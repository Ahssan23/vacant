import express from "express";
import { dashboardController, postDataController,deleteDataController } from "../controllers/dashboard.js";
import { verifyToken } from "../middleware/verify.js";



const dashboard = express.Router();



dashboard.get("/api/dashboard/fetch-data" ,dashboardController);

dashboard.post("/api/dashboard/post-data", verifyToken, postDataController);

dashboard.delete("/api/dashboard/delete-data/:id", verifyToken, deleteDataController);
export default dashboard;
