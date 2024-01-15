import express from 'express';
import { getAllCategories, getItemsByCategoryId, getCategoryById } from '../Model/itemModel.js';
import { getRecommendation } from '../Model/recommendationModel.js';

const router = express.Router();

router.get("/api/mainstore", async (_, res) => {
  try {
    const items = await getAllCategories();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving items' });
  }
});

router.get("/api/category/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const items = await getCategoryById(id);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving items' });
    }
});

router.post("/api/recommendation", async (req, res) => {
  const { arrayOfItems, weatherCondition, meansOfTransport, location, radius } = req.body;
  console.log("req.body", req.body)
  try {
      const recommendation = await getRecommendation(arrayOfItems, weatherCondition, meansOfTransport, location, radius);
      res.json(recommendation);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while getting recommendations' });
  }
});

router.get("/api/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const items = await getItemsByCategoryId(id);
    if (items.length > 0) {
      res.json(items);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the item' });
  }
});

export default router;