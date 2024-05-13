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

export async function deleteCart(cartId) {
  const result = await pool.query('DELETE FROM cart_products WHERE cartid = $1', [cartId]);
    return result;
}

export async function updateCart(cartId, cart) {
  const { products, categories } = cart;
  console.log('cartIdddd',cartId)
  let result = {
     success: false,
     message: '',
    updatedCart: {
       cartId: cartId,
       products: [],
       categories: []
     }
  };
 
  try {
     // First, delete existing cart_products entries for this cartId
     await pool.query('DELETE FROM cart_products WHERE cartid = $1', [cartId]);
    // Then, insert the new products into the cart_products table
    for (let product of products) {
      await pool.query('INSERT INTO cart_products (cartid, productid, categoryid) VALUES ($1, $2, $3)', [cartId, product.productid, product.categoryid]);
      // Assuming you want to return the updated product list
      result.updatedCart.products.push(product);
    }

    // Handle categories similarly, if needed
    for (let category of categories) {
      await pool.query('INSERT INTO cart_products (cartid, categoryid) VALUES ($1, $2)', [cartId, category.categoryid]);
      // Assuming you want to return the updated category list
      result.updatedCart.categories.push(category);
    }
  
 
     result.success = true;
     result.message = 'Cart updated successfully';
  } catch (error) {
     console.error('Error updating cart:', error);
     result.message = 'An error occurred while updating the cart';
  }
 
  return result;
 }