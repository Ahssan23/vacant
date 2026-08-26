import express from "express";
import { acceptData } from "../controllers/accept.js";

const accept = express.Router();

// Pass acceptData directly as the route handler
accept.post("/api/accept-data", acceptData);
export default accept;