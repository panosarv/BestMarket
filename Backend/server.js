import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";
import itemRouter from './Routes/mainStoreRoutes.js';

import authRoutes from './Routes/authRoutes.js';
import cartRoutes from './Routes/cartRoutes.js';
import verifyToken from "./MDW/authJwtMDW.js";
const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(itemRouter);
app.use(authRoutes);
app.use(cartRoutes);

ViteExpress.listen(app, port, () => console.log("Server is listening..."));
