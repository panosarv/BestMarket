import config from '../Config/dbConfig.js';
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool(config);

export async function getCartProductsUserId(userId) {
  const result = await pool.query(`
  SELECT p.productid AS product_id,
  p.image AS product_image,
  p.description AS product_description,
  p.name AS product_name,
  p.categoryid AS product_categoryid,
  cat.categoryid AS category_id,
  cat.name AS category_name,
  cat.description AS category_description,
  cat.image AS category_image, c.cartid
  FROM bm_user u
  JOIN cart c ON u.id = c.userid
  JOIN cart_products cp ON c.cartid = cp.cartid
  LEFT JOIN product p ON cp.productid = p.productid
  LEFT JOIN category cat ON cp.categoryid = cat.categoryid
  WHERE u.id = $1;
  `, [userId]);
  const cartItems = result.rows;
  const response = {} 
  cartItems.forEach(item =>{
    if (!response[item.cartid]){
      response[item.cartid] = {
        cartid: item.cartid,
        products: [],
        categories: []
      }
    }
    if (item.product_id){
      response[item.cartid].products.push(
        {
          productid: item.product_id,
          image: item.product_image,
          description: item.product_description,
          name: item.product_name,
          categoryid: item.product_categoryid
        }
      )
    } else {
      response[item.cartid].categories.push({
        categoryid: item.category_id,
        name: item.category_name,
        description: item.category_description,
        image: item.category_image
      })
    }
  })
  return Object.values(response);

}

export async function saveCart(cart,user) {
  // console.log('cart:',cart);
  // console.log('user:',user);
  const result = await pool.query('INSERT INTO Cart (userid,price) VALUES ($1, $2) RETURNING *', [user, '-1']);
  const cartId = result.rows[0].cartid;
 
  for (let item of cart) {
    await pool.query('INSERT INTO cart_products (cartid, productid, categoryid) VALUES ($1, $2, $3)', [cartId, item.productid, item.categoryid]);
  }
  return result.rows[0];
}