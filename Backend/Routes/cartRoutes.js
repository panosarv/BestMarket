import express from 'express';
import {getCartProductsUserId, saveCart} from '../Controllers/cartController.js';
const router = express.Router();

router.post("/api/saveCart", async (req, res) => {
    const {user,cart} = req.body;
    try {
        const items = await saveCart(user,cart);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding to cart' });
    }
});

router.post("/api/getCartProductsUserId/:userId", async (req, res) => {
    const userId = req.body.userId;
    try {
        const items = await getCartProductsUserId(userId);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving cart' });
    }
});