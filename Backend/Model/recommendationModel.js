import pg from 'pg';
import geo_distance from 'geo-distance'
import {combine,calculateCostOfCart} from './recommendationModelHelper.js'
const { Pool } = pg;
const {Distance} = geo_distance;
const pool = new Pool({
  user: 'pngarv',
  host: 'dpg-ck3jr4j6fquc73d29beg-a.frankfurt-postgres.render.com',
  database: 'bestmarket_database',
  password: 'E80fkg8MbGk3MEakP7P6ls6bzQvl3iMZ',
  port: 5432,
  ssl:true,
});

export async function getRecommendation(arrayOfItems,weather,meansOfTransport,location,radius){
          const { longitude, latitude } = location;
          const radiusInMeters = radius * 1000; 
          const weatherQuery = `SELECT * FROM "WeatherCondition" WHERE "code"=${weather}`;
          const weatherWeight = (await pool.query(weatherQuery)).rows[0].weight;
          const transportQuery = `SELECT * FROM "MeansOfTransport" WHERE "code"=${meansOfTransport}`;
          const transportWeight = (await pool.query(transportQuery)).rows[0].weight;
          const query = `SELECT p.*, s.*, ps.price
          FROM "Product" p
          JOIN "ProductSupermarket" ps ON p."productid" = ps."productid"
          JOIN "Supermarket" s ON ps."supermarketid" = s."supermarketid"
          WHERE earth_box(ll_to_earth(${latitude}, ${longitude}), ${radiusInMeters}) @> ll_to_earth(s."longitude", s."latitude")
          AND p."categoryid" IN (${arrayOfItems.map((item) => item.categoryid).join(',')})
          `;
          const result = (await pool.query(query)).rows;
          const resultWithDistance = result.map((item) => {
            const { latitude: itemLatitude, longitude: itemLongitude } = item;
            const itemLocation = { latitude: itemLatitude, longitude: itemLongitude };
            const distance = Distance.between(location, itemLocation);
            return { ...item, distanceFromUser: distance.human_readable() };
          });
          const indiviualProducts=[]
          for (const item of resultWithDistance){
            if(indiviualProducts.includes(item.productid)){
              continue;
            }
            else{
              indiviualProducts.push(item.productid)
            }
          }
          const listsOfAllProductsPerCategory=[]
          const categories = arrayOfItems.filter((item) => !item.hasOwnProperty('productid'));
          const products = arrayOfItems.filter((item) => item.hasOwnProperty('productid')).map(item => item.productid);
          for (const category of categories) {
            const products = indiviualProducts.filter((item) => item.categoryid === category.categoryid);
            listsOfAllProductsPerCategory.push(products)
          }
          const allPossibleCarts=[]
          const supermarketsProductsMap = new Map();
          combine(listsOfAllProductsPerCategory,products, allPossibleCarts, listsOfAllProductsPerCategory.length);
          allPossibleCarts.forEach((cart) => {
            
            const recordsOfProductSupermarketThatProductsAreInCart = resultWithDistance.filter((item) => cart.includes(item.productid));
            const supermarketIds = recordsOfProductSupermarketThatProductsAreInCart.map(item => item.supermarketid);
            const supermarketCount = supermarketIds.reduce((acc, id) => {
              acc[id] = (acc[id] || 0) + 1;
              return acc;
            }, {});
            const recordsOfProductSupermarketThatAllProductsAreInSupermarket = recordsOfProductSupermarketThatProductsAreInCart.filter(item => supermarketCount[item.supermarketid] == cart.length);      
            const supermarketIdsThatAllProductsAreInSupermarket = Set(recordsOfProductSupermarketThatAllProductsAreInSupermarket.map(item => item.supermarketid));
            for(const supermarketId of supermarketIdsThatAllProductsAreInSupermarket){
              const cartPerSupermarket = recordsOfProductSupermarketThatAllProductsAreInSupermarket.filter(item => item.supermarketid === supermarketId);
              const cost = calculateCostOfCart(cartPerSupermarket,supermarketId);
              if(supermarketsProductsMap.has(supermarketId)){
                supermarketsProductsMap.get(supermarketId).push({cart:cartPerSupermarket,cost:cost,distance:cartPerSupermarket[0].distanceFromUser});
              }
              else{
                supermarketsProductsMap.set(supermarketId,[{cart:cartPerSupermarket,cost:cost}]);
              }
            }
            
          });
          for(const [key,value] of supermarketsProductsMap){
            const sortedArray = value.sort((a,b) => a.cost - b.cost);
            supermarketsProductsMap.set(key,sortedArray[0]);
          }
          
          
          
      }