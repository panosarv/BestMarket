import express from 'express';
import { getAllCategories, getItemsByCategoryId, getCategoryById } from '../Models/itemModel.js';
import { getRecommendation } from '../Controllers/recommendationController.js';
import { getHeatmap } from '../Controllers/heatmapController.js';

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

router.post("/api/heatmap", async (req, res) => {
  const { user_location } = req.body;
  try {
    const heatmap = await getHeatmap(user_location);
    res.json(heatmap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while getting heatmap' });
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