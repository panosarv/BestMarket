import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'pngarv',
  host: 'dpg-ck3jr4j6fquc73d29beg-a.frankfurt-postgres.render.com',
  database: 'bestmarket_database',
  password: 'E80fkg8MbGk3MEakP7P6ls6bzQvl3iMZ',
  port: 5432,
  ssl:true,
});

export async function getAllCategories() {
  const result = await pool.query('SELECT * FROM  "Category"');
  return result.rows;
}

export async function getItemsByCategoryId(id) {
  const result = await pool.query('SELECT * FROM "Product" WHERE categoryid = $1', [id]);
  return result.rows;
}

export async function getCategoryById(id) {
  const result = await pool.query('SELECT * FROM "Category" WHERE categoryid = $1', [id]);
  return result.rows;
}