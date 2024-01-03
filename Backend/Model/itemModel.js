import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'bestmarket_user',
  host: 'dpg-cm4ccp0cmk4c73cj2ffg-a.frankfurt-postgres.render.com',
  database: 'bestmarket',
  password: 'x5orZW8qHOOgQMjXM6vsnMcgufl65Vni',
  port: 5432,
  ssl:true,
});

export async function getAllCategories() {
  const result = await pool.query('SELECT * FROM  Category');
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