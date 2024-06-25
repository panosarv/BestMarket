import express from 'express';
import { getAllParentCategories, getItemsByCategoryId, getChildCategoriesByParentId } from '../Models/itemModel.js';
import { getRecommendation } from '../Controllers/recommendationController.js';
import { getHeatmap } from '../Controllers/heatmapController.js';

const router = express.Router();

router.get("/api/mainstore", async (_, res) => {
  try {
    const items = await getAllParentCategories();
    res.status(201).json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving items' });
  }
});

router.get("/api/category/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const items = await getChildCategoriesByParentId(id);
        res.status(201).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving items' });
    }
});

router.get('/api/subcategory/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const items = await getChildCategoriesByParentId(id);
        res.status(201).json(items);
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
      if(recommendation.length === 0){
          res.status(404).json({ error: 'No recommendations found' });
      }
      else{

        res.status(201).json(recommendation);
      }
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while getting recommendations' });
  }
});

router.post("/api/heatmap", async (req, res) => {
  const { user_location } = req.body;
  try {
    const heatmap = await getHeatmap(user_location);
    res.status(201).json(heatmap);
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
      res.status(201).json(items);
    } else {
      res.status(404).json({ error: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while retrieving the item' });
  }
});

export default router;