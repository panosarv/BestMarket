import pg from 'pg';
import fetch from 'node-fetch';
import config from '../Config/dbConfig.js';
import { combine, calculateCostOfCart, formatSupermarketData, getDistanceFromLatLonInKm } from './recommendationControllerHelper.js';

const { Pool } = pg;
const pool = new Pool(config);

export async function getRecommendation(arrayOfItems, weather, meansOfTransport, location, radius) {
  const { lng, lat } = location;
  const radiusInMeters = radius * 10000; 

  const query = `SELECT p.*, s.*, ps.price
  FROM Product p
  JOIN ProductSupermarket ps ON p.productid = ps.productid
  JOIN Supermarket s ON ps.supermarketid = s.supermarketid
  WHERE earth_box(ll_to_earth(${lng}, ${lat}), ${radiusInMeters}) @> ll_to_earth(s.longitude, s.latitude)
  AND p.productid IN (${arrayOfItems.map((item) => item.productid).join(',')})
  `;

  const result = (await pool.query(query)).rows;
  if (result.length === 0) {
    return [];
  }

  const resultWithDistance = result.map((item) => {
    const itemLocation = { lat: item.latitude, lng: item.longitude };
    const distance = getDistanceFromLatLonInKm(location.lat, location.lng, itemLocation.lat, itemLocation.lng);
    return { ...item, distanceFromUser: distance };
  });

  const individualProducts = [];
  for (const item of resultWithDistance) {
    if (individualProducts.includes(item)) {
      continue;
    } else {
      individualProducts.push(item);
    }
  }

  let listsOfAllProductsPerCategory = [];
  const categories = arrayOfItems.filter((item) => !item.hasOwnProperty('productid'));
  const products = arrayOfItems.filter((item) => item.hasOwnProperty('productid')).map(item => ({
    productid: item.productid,
    quantity: item.quantity
  }));

  for (const category of categories) {
    const products = individualProducts.filter((item) => item.categoryid === category.categoryid).map((item) => ({ ...item, quantity: category.quantity }));
    listsOfAllProductsPerCategory.push(products);
  }

  listsOfAllProductsPerCategory = listsOfAllProductsPerCategory.map((item) => item.map((item) => ({
    productid: item.productid,
    quantity: item.quantity
  })));

  listsOfAllProductsPerCategory = listsOfAllProductsPerCategory.map((item) => [...new Set(item)]);

  const allPossibleCarts = [];
  const supermarketsProductsMap = new Map();
  combine(listsOfAllProductsPerCategory, products, allPossibleCarts, listsOfAllProductsPerCategory.length);

  allPossibleCarts.forEach((cart) => {
    let cartIds = cart.map((item) => item.productid);
    const cartSet = new Set(cartIds);
    cartIds = Array.from(cartSet);
    console.log("cart", cart);
    const recordsOfProductSupermarketThatProductsAreInCart = resultWithDistance.filter((item) => cartIds.includes(item.productid));
    const supermarketIds = recordsOfProductSupermarketThatProductsAreInCart.map(item => item.supermarketid);
    const supermarketCount = supermarketIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    const recordsOfProductSupermarketThatAllProductsAreInSupermarket = recordsOfProductSupermarketThatProductsAreInCart.filter(item => supermarketCount[item.supermarketid] == cart.length);
    console.log("recordsOfProductSupermarketThatAllProductsAreInSupermarket", recordsOfProductSupermarketThatAllProductsAreInSupermarket);
    const supermarketIdsThatAllProductsAreInSupermarket = new Set(recordsOfProductSupermarketThatAllProductsAreInSupermarket.map(item => item.supermarketid));
    for (const supermarketId of supermarketIdsThatAllProductsAreInSupermarket) {
      const cartPerSupermarket = recordsOfProductSupermarketThatAllProductsAreInSupermarket.filter(item => item.supermarketid === supermarketId);
      const cost = calculateCostOfCart(cart, cartPerSupermarket, supermarketId);
      if (supermarketsProductsMap.has(supermarketId)) {
        supermarketsProductsMap.get(supermarketId).push({ cart: cartPerSupermarket, cost: cost, distance: cartPerSupermarket[0].distanceFromUser });
      } else {
        supermarketsProductsMap.set(supermarketId, [{ cart: cartPerSupermarket, cost: cost, distance: cartPerSupermarket[0].distanceFromUser }]);
      }
    }
  });

  for (const [key, value] of supermarketsProductsMap) {
    const sortedArray = value.sort((a, b) => a.cost - b.cost);
    supermarketsProductsMap.set(key, sortedArray[0]);
  }

  const supermarkets = Array.from(supermarketsProductsMap, ([supermarketId, { cart, cost, distance }]) => ({
    name: supermarketId,
    cost: cost,
    distance: distance,
    rating: resultWithDistance.find(item => item.supermarketid === supermarketId).rating // Include rating
  }));

  const predictionData = formatSupermarketData(supermarkets, weather, meansOfTransport);

  const response = await fetch('https://bestmarket-python-server.onrender.com/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(predictionData)
  });

  const data = await response.json();
  const sortedRecommendation = data.sort((a, b) => b.score - a.score);
  console.log('sortedRecommendation-->',sortedRecommendation);
  const recommendedSupermarketId = sortedRecommendation[0].supermarketId;
  const recommendationIds = sortedRecommendation.map((item) => item.supermarketId);
  const recommendationQuery = `SELECT * FROM Supermarket WHERE supermarketid IN (${recommendationIds.join(',')})`;
  const recommendationResult = (await pool.query(recommendationQuery)).rows;
  const idIndexMapping = recommendationIds.reduce((mapping, id, index) => {
    mapping[id] = index;
    return mapping;
  }, {});
  const recommendationResultWithDetails = recommendationResult.map((supermarket) => {
    const recommendation = supermarkets.find(item => item.name === supermarket.supermarketid);
    return {
      ...supermarket,
      distance: Math.round(recommendation.distance * 100) / 100, // Assuming 'distance' is the property name for distance
      cost: recommendation.cost, // Assuming 'cost' is the property name for cost
      rating: recommendation.rating // Include rating
    };
  });

  const sortedRecommendationResult = recommendationIds.map(id => recommendationResultWithDetails[idIndexMapping[id]]);
  const nearestSupermarket = sortedRecommendationResult.sort((a, b) => a.distance - b.distance)[0].supermarketid;
  const cheapestSupermarket = sortedRecommendationResult.sort((a, b) => a.cost - b.cost)[0].supermarketid;
  console.log('sortedRecommendationResult--->',sortedRecommendationResult);
  const recommendedSupermarket = sortedRecommendationResult.find(sm => sm.supermarketid === recommendedSupermarketId) ; 
  const responseData = [];
  sortedRecommendationResult.map((supermarket, index) => {
    let category;
    if (supermarket.supermarketid ===  recommendedSupermarketId) {
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
    } if (supermarket.supermarketid === cheapestSupermarket) {
      category = 'cheapest';
      responseData.push({
        ...supermarket,
        category: category
      });
    } 
  });

  const addHeatMapQuery = `INSERT INTO Heatmap (user_latitude, user_longitude, supermarketid, supermarket_longitude, supermarket_latitude) VALUES (${lat}, ${lng}, ${recommendedSupermarket.supermarketid}, ${recommendedSupermarket.longitude}, ${recommendedSupermarket.latitude})`;
  await pool.query(addHeatMapQuery);

  console.log("responseData", responseData);
  return responseData;
}
