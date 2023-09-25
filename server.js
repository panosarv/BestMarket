import express from "express";
import ViteExpress from "vite-express";
import pg from 'pg';
const { Pool } = pg;
const app = express();
// Create a new pool using your database connection parameters
const pool = new Pool({
  user: 'pngarv',
  host: 'dpg-ck3jr4j6fquc73d29beg-a.frankfurt-postgres.render.com',
  database: 'bestmarket_database',
  password: 'E80fkg8MbGk3MEakP7P6ls6bzQvl3iMZ',
  port: 5432,
  ssl:true,
});

// Endpoint to get all items
app.get("/api/mainstore", async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM  "Category"');
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving items' });
  }
});

// Endpoint to get an item by id
app.get("/api/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM "Product" WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the item' });
  }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));