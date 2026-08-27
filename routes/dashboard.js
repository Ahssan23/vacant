import express from "express";
import { dashboardController, postDataController, deleteDataController } from "../controllers/dashboard.js";
import { verifyToken } from "../middleware/verify.js";
import { uploadMiddleware } from "../config/upload.js";

const dashboard = express.Router();

dashboard.get("/api/dashboard/fetch-data", dashboardController);

// Attach multer before post controller
dashboard.post("/api/dashboard/post-data", verifyToken, uploadMiddleware, postDataController);

dashboard.delete("/api/dashboard/delete-data/:id", verifyToken, deleteDataController);

export default dashboard;