import pg from 'pg';
import fetch from 'node-fetch';
import config from '../Config/dbConfig.js';
import {combine,calculateCostOfCart,formatSupermarketData,getDistanceFromLatLonInKm} from './recommendationControllerHelper.js'
const { Pool } = pg;
const pool = new Pool(config);

export async function getRecommendation(arrayOfItems,weather,meansOfTransport,location,radius){
          const { lng, lat } = location;
          console.log("location", location)
          console.log("weather", weather)
          console.log("meansOfTransport", meansOfTransport)
          const radiusInMeters = radius * 1000; 
          const query = `SELECT p.*, s.*, ps.price
          FROM Product p
          JOIN ProductSupermarket ps ON p.productid = ps.productid
          JOIN Supermarket s ON ps.supermarketid = s.supermarketid
          WHERE earth_box(ll_to_earth(${lng}, ${lat}), ${radiusInMeters}) @> ll_to_earth(s.longitude, s.latitude)
          AND p.categoryid IN (${arrayOfItems.map((item) => item.categoryid).join(',')})
          `;
          
          const result = (await pool.query(query)).rows;
          console.log('result', result )
          const resultWithDistance = result.map((item) => {
            const itemLocation = { lat: item.latitude, lng: item.longitude };
            const distance =  getDistanceFromLatLonInKm(location.lat, location.lng, itemLocation.lat, itemLocation.lng);
            console.log("distance", distance)
            return { ...item, distanceFromUser: distance };
          });
          const indiviualProducts=[]
          for (const item of resultWithDistance){
            if(indiviualProducts.includes(item)){
              continue;
            }
            else{
              indiviualProducts.push(item)
            }
          }
          let listsOfAllProductsPerCategory=[]
          const categories = arrayOfItems.filter((item) => !item.hasOwnProperty('productid'));
          const products = arrayOfItems.filter((item) => item.hasOwnProperty('productid')).map(item => item.productid);
          for (const category of categories) {
            const products = indiviualProducts.filter((item) => item.categoryid === category.categoryid);
            listsOfAllProductsPerCategory.push(products)
          }
          listsOfAllProductsPerCategory = listsOfAllProductsPerCategory.map((item) => item.map((item) => item.productid));
          listsOfAllProductsPerCategory = listsOfAllProductsPerCategory.map((item) => [...new Set(item)]);
          const allPossibleCarts=[]
          const supermarketsProductsMap = new Map();
          combine(listsOfAllProductsPerCategory,products, allPossibleCarts, listsOfAllProductsPerCategory.length);
          allPossibleCarts.forEach((cart) => {
            console.log("cart", cart)
            const recordsOfProductSupermarketThatProductsAreInCart = resultWithDistance.filter((item) => cart.includes(item.productid));
            const supermarketIds = recordsOfProductSupermarketThatProductsAreInCart.map(item => item.supermarketid);
            const supermarketCount = supermarketIds.reduce((acc, id) => {
              acc[id] = (acc[id] || 0) + 1;
              return acc;
            }, {});
            const recordsOfProductSupermarketThatAllProductsAreInSupermarket = recordsOfProductSupermarketThatProductsAreInCart.filter(item => supermarketCount[item.supermarketid] == cart.length);      
            const supermarketIdsThatAllProductsAreInSupermarket = new Set(recordsOfProductSupermarketThatAllProductsAreInSupermarket.map(item => item.supermarketid));
            for(const supermarketId of supermarketIdsThatAllProductsAreInSupermarket){
              const cartPerSupermarket = recordsOfProductSupermarketThatAllProductsAreInSupermarket.filter(item => item.supermarketid === supermarketId);
              const cost = calculateCostOfCart(cartPerSupermarket,supermarketId);
              
              if(supermarketsProductsMap.has(supermarketId)){
                supermarketsProductsMap.get(supermarketId).push({cart:cartPerSupermarket,cost:cost,distance:cartPerSupermarket[0].distanceFromUser});
              
              }
              else{
                supermarketsProductsMap.set(supermarketId,[{cart:cartPerSupermarket,cost:cost,distance:cartPerSupermarket[0].distanceFromUser}]);
              }
            }
            
          });
          for(const [key,value] of supermarketsProductsMap){
            const sortedArray = value.sort((a,b) => a.cost - b.cost);
            supermarketsProductsMap.set(key,sortedArray[0]);
          }

          const supermarkets = Array.from(supermarketsProductsMap, ([supermarketId, {cart, cost, distance}]) => ({
            name: supermarketId,
            cost: cost,
            distance: distance,
          }));
          const predictionData = formatSupermarketData(supermarkets,weather,meansOfTransport);
          // Send POST request to Flask server
          const response = await fetch('http://localhost:5000/predict', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(predictionData)
          });
          // Get the response data
          const data = await response.json();
          console.log("data", data)
          const sortedRecommendation = data.sort((a,b) => b.score - a.score);
          const recommendationIds=sortedRecommendation.map((item) => item.supermarketId);
          console.log("recommendationIds", recommendationIds, recommendationIds.join(',') )
          const recommendationQurey = `SELECT * FROM Supermarket WHERE supermarketid IN (${recommendationIds.join(',')})`;
          const recommendationResult = (await pool.query(recommendationQurey)).rows;
          console.log("recommendationResult", recommendationResult)
          const idIndexMapping = recommendationIds.reduce((mapping, id, index) => {
            mapping[id] = index;
            return mapping;
          }, {});
          const recommendationResultWithDetails = recommendationResult.map((supermarket) => {
            const recommendation = supermarkets.find(item => item.name === supermarket.supermarketid);
            return {
              ...supermarket,
              distance: Math.round(recommendation.distance,2)/1000,
               // Assuming 'distance' is the property name for distance
              cost: recommendation.cost // Assuming 'cost' is the property name for cost
            };
          });
          console.log("recommendationResultWithDetails", recommendationResultWithDetails)
          const sortedRecommendationResult = recommendationIds.map(id => recommendationResultWithDetails[idIndexMapping[id]]);
          const nearestSupermarket = sortedRecommendationResult.sort((a,b) => a.distance - b.distance)[0].supermarketid;
          const chepestSupermarket = sortedRecommendationResult.sort((a,b) => a.cost - b.cost)[0].supermarketid;
          const recommendedSupermarket = sortedRecommendationResult[0]; 
          const responseData=[];
          sortedRecommendationResult.map((supermarket, index) => {
            let category;
            if (index ===  0) {
              category = 'recommended';
              responseData.push({
                ...supermarket,
                category: category
              });
            } if (supermarket.supermarketid === nearestSupermarket) {
              category = 'nearest';
              responseData.push({
                ...supermarket,
                category: category
              });
            } if (supermarket.supermarketid === chepestSupermarket) {
              category = 'cheapest';
              responseData.push({
                ...supermarket,
                category: category
              });
            } 
          });
          
          const addHeatMapQuery=`INSERT INTO Heatmap (user_latitude,user_longitude,supermarketid,supermarket_longitude,supermarket_latitude) VALUES (${lat},${lng},${recommendedSupermarket.supermarketid},${recommendedSupermarket.longitude},${recommendedSupermarket.latitude})`;
          const insertResult=await pool.query(addHeatMapQuery);
          console.log("insertResult", insertResult)
          // const data = await response.json();
      
          // Return the data
          console.log("responseData", responseData)
          return responseData;
      }