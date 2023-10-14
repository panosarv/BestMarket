import pg from 'pg';
import geo_distance from 'geo-distance'
import {combine} from './recommendationModelHelper.js'
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

export async function getRecommendation(arrayOfItems,weather,meansOfTransport,location,radious){
          const { longitude, latitude } = location;
          const radiusInMeters = radius * 1000; 

          const query = `SELECT p.*, s.*, ps.price
          FROM "Product" p
          JOIN "ProductSupermarket" ps ON p."productid" = ps."productid"
          JOIN "Supermarket" s ON ps."supermarketid" = s."supermarketid"
          WHERE earth_box(ll_to_earth(${latitude}, ${longitude}), ${radiusInMeters}) @> ll_to_earth(s."longitude", s."latitude")
          `;
          const result = (await pool.query(query)).rows;
          const resultWithDistance = result.map((item) => {
            const { latitude: itemLatitude, longitude: itemLongitude } = item;
            const itemLocation = { latitude: itemLatitude, longitude: itemLongitude };
            const distance = Distance.between(location, itemLocation);
            return { ...item, distanceFromUser: distance, supermarket_product_key: `${item.supermarketid}${item.productid}` };
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
          const listOfAllProductsPerCategory=[]
          const categories = arrayOfItems.filter((item) => !item.hasOwnProperty('productid'));
          const products = arrayOfItems.filter((item) => item.hasOwnProperty('productid')).map(item => item.productid);
          for (const category of categories) {
            const products = indiviualProducts.filter((item) => item.categoryid === category.categoryid);
            listOfAllProductsPerCategory.push(products)
          }
          const allPossibleCarts=[]
          const mapCartSupermarket = new Map();
          combine(listOfAllProductsPerCategory,products, allPossibleCarts, listOfAllProductsPerCategory.length);
          allPossibleCarts.forEach((cart) => {
            
            const possibleSupermarketsWithProductsForCart = resultWithDistance.filter((item) => cart.includes(item.productid)).map(
              (item) => { return { supermarketid: item.supermarketid, productid:item.productid, distanceFromUser: item.distanceFromUser, price:item.price } }
              );
            const supermarketIds = possibleSupermarketsWithProductsForCart.map(item => item.supermarketid);
            const supermarketCounts = supermarketIds.reduce((acc, id) => {
              acc[id] = (acc[id] || 0) + 1;
              return acc;
            }, {});
            const eligibleSupermarkets = possibleSupermarketsWithProductsForCart.filter(item => supermarketCounts[item.supermarketid] == cart.length);            
            mapCartSupermarket.set(cart, eligibleSupermarkets);
          }
          );
          
      }