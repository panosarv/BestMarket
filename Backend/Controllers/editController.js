// editController.js
import config from '../Config/dbConfig.js';
import pg from 'pg';
const { Pool } = pg;
const pool = new Pool(config);

export async function editUserDetails(id, username, email) {
  let query = 'UPDATE bm_user SET ';
  const queryParams = [];
  let paramCounter = 1;

  if(!username && !email) return { success: false, message: 'No details provided' };

  if (username) {
    query += `username = $${paramCounter}`;
    queryParams.push(username);
    paramCounter++;
  }

  if (email) {
    if (username) query += ', ';
    query += `email = $${paramCounter}`;
    queryParams.push(email);
    paramCounter++;
  }

  query += ` WHERE id = $${paramCounter}`;
  queryParams.push(id);

  console.log(query, queryParams)
  const conflictQuery = `
    SELECT * FROM bm_user 
    WHERE (username = $1 OR email = $2) AND id != $3
  `;
  const conflictParams = [username || '', email || '', id];

  try {
    const conflictCheck = await pool.query(conflictQuery, conflictParams);
    if (conflictCheck.rows.length > 0) {
      return { success: false, message: "Username or Email is already in use!" };
    }

    await pool.query(query, queryParams);
    return { success: true, message: "Your details have been updated!" };
  } catch (err) {
    console.error('Error updating user details:', err);
    return { success: false, message: 'An error occurred while updating details' };
  }
  
}
export async function getUserDetails(id) {
  const result = await pool.query('SELECT * FROM bm_user WHERE id = $1', [id]);
  if (result.rows.length > 0) {
    return { success: true, user: result.rows[0] };
  } else {
    return { success: false, message: 'User not found' };
  }
}
  