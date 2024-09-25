import express from 'express';
import { getCartProductsUserId, saveCart, updateCart, deleteCart, deleteAllUserCarts } from '../Controllers/cartController.js';
import verifyToken from '../MDW/authJwtMDW.js';

const router = express.Router();

// Middleware to verify token
router.use(verifyToken);

// Save cart route
router.post("/api/saveCart", async (req, res) => {
    const cart = req.body.cart;
    const user = req.userId;
    try {
        const items = await saveCart(cart, user);
        res.status(201).json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while adding to cart' });
    }
});

// Get cart products for a user
router.post("/api/getCartProductsUserId", async (req, res) => {
    const userId = req.userId;
    try {
        const items = await getCartProductsUserId(userId);
        res.json(items);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving cart' });
    }
});

// Delete a specific cart
router.post("/api/deleteCart", async (req, res) => {
    const { cartid } = req.body; // Expecting cartid from the request body
    try {
        const result = await deleteCart(cartid);
        res.status(200).json({ success: true, message: 'Cart deleted successfully', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting cart' });
    }
});

// Delete all carts for the logged-in user
router.post("/api/deleteAllUserCarts", async (req, res) => {
    const userId = req.userId; // Use the userId from the token
    try {
        const result = await deleteAllUserCarts(userId);
        res.status(200).json({ success: true, message: 'All carts deleted successfully', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while deleting all carts' });
    }
});

// Update a cart
router.post("/api/updateCart", async (req, res) => {
    const { cart } = req.body;

    try {
        const updatedCart = await updateCart(cart.cartid, cart);
        res.status(201).json(updatedCart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while updating the cart' });
    }
});

export default router;
