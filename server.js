import express from "express";
import ViteExpress from "vite-express";
import pg from 'pg';
const { Pool } = pg;
const app = express();

// Model
const pool = new Pool({
  user: 'pngarv',
  host: 'dpg-ck3jr4j6fquc73d29beg-a.frankfurt-postgres.render.com',
  database: 'bestmarket_database',
  password: 'E80fkg8MbGk3MEakP7P6ls6bzQvl3iMZ',
  port: 5432,
  ssl:true,
});

//To be put in a controller
async function getAllItems() {
  const result = await pool.query('SELECT * FROM  "Category"');
  return result.rows;
}

async function getItemById(id) {
  const result = await pool.query('SELECT * FROM "Product" WHERE id = $1', [id]);
  return result.rows;
}

// Controller
app.get("/api/mainstore", async (_, res) => {
  try {
    const items = await getAllItems();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving items' });
  }
});

app.get("/api/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await getItemById(id);
    if (item.length > 0) {
      res.json(item[0]);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the item' });
  }
});

// Start the server
ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));