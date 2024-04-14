import express from 'express';
import {getCartProductsUserId, saveCart,updateCart} from '../Controllers/cartController.js';
const router = express.Router();

router.post("/api/saveCart", async (req, res) => {
    const {user,cart} = req.body;
    try {
        const items = await saveCart(cart,user);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding to cart' });
    }
});

router.post("/api/getCartProductsUserId", async (req, res) => {
    const userId = req.body.userId;
    try {
        const items = await getCartProductsUserId(userId);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving cart' });
    }
});

router.post("/api/deleteCart", async (req, res) => {
    const {user,cart} = req.body;
    try {
        const items = await deleteCart(cart,user);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting cart' });
    }
});

router.post("/api/updateCart", async (req, res) => {
    const { cart } = req.body;

    try {
       const updatedCart = await updateCart(cart.cartid, cart);
       res.json(updatedCart);
    } catch (err) {
       console.error(err);
       res.status(500).json({ error: 'An error occurred while updating the cart' });
    }
   });

export default router;