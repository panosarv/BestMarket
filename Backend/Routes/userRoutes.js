import express from 'express';
import userController from '../Controllers/authController.js';
import mdw from '../mdw/index.js';
const router = express.Router();
function userRoutes(app){
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });
}
router.post('/signup', 
    mdw.checkDuplicateUsernameOrEmail,

userController.signup);
router.post('/signin', userController.signin);

export default router;
