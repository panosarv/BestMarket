
import express from 'express';
import { editUserDetails, getUserDetails } from '../Controllers/editController.js';
import verifyToken from '../MDW/authJwtMDW.js';

const router = express.Router();

router.use(verifyToken);

router.post('/api/editUserDetails', async (req, res) => {
  const {username, email } = req.body;
  console.log('editUserDetails', req)
  const userId=req.userId;
  try {
    const result = await editUserDetails(userId, username, email);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while updating details' });
  }
});

router.post('/api/getUserDetails', async (req, res) => {
    const userId = req.userId;
    try {
        const result = await getUserDetails(userId);
        if (result.success) {
        res.status(200).json(result);
        } else {
        res.status(400).json(result);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while retrieving details' });
    }
    });

export default router;
