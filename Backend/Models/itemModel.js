import pg from 'pg';
const { Pool } = pg;
import config from "../Config/dbConfig.js";
const pool = new Pool(config);

export async function getAllParentCategories() {
  const result = await pool.query('SELECT * FROM  Category WHERE parent_category_id IS NULL');
  return result.rows;
}

export async function getChildCategoriesByParentId(id) {
  const result = await pool.query('SELECT * FROM Category WHERE parent_category_id = $1', [id]);
  return result.rows;
}

export async function getItemsByCategoryId(id) {
  const result = await pool.query('SELECT * FROM Product WHERE categoryid = $1', [id]);
  return result.rows;
}

export async function getCategoryById(id) {
  const result = await pool.query('SELECT * FROM Category WHERE categoryid = $1', [id]);
  return result.rows;
}