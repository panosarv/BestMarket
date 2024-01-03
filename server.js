import express from "express";
import ViteExpress from "vite-express";
import cors from "cors";
import itemRouter from './Backend/Controllers/itemController.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(itemRouter);

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));