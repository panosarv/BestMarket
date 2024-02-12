import config from '../Config/dbConfig.js';
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool(config);

export async function getCartProductsUserId(userId) {
  const result = await pool.query(`
    SELECT p.*
    FROM bm_user u
    JOIN cart c ON u.userid = c.userid
    JOIN cart_products cp ON c.cartid = cp.cartid
    JOIN product p ON cp.productid = p.productid
    WHERE u.userid = $1
  `, [userId]);
  return result.rows;
}

export async function saveCart(cart,user) {
  const result = await pool.query('INSERT INTO Cart (userid,price) VALUES ($1, $2) RETURNING *', [user.id, cart.price]);
  const cartId = result.rows[0].id;
  for (let i = 0; i < cart.items.length; i++) {
    const item = cart.items[i];
    await pool.query('INSERT INTO cart_products (cartid, productid) VALUES ($1, $2, $3)', [cartId, item.productid, item.quantity]);
  }
  return result.rows[0];
}