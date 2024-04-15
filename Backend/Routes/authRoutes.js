import express from 'express';
import authController from '../Controllers/authController.js';
import mdw from '../MDW/index.js';
const router = express.Router();
router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
    });

router.post('/api/auth/signup', 
    mdw.checkDuplicateUsernameOrEmail,
    authController.signup);
router.post('/api/auth/signin', authController.signin);

export default router;
