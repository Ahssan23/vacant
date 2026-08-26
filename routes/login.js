import express from "express";
import { loginController } from "../controllers/login.js";



const login = express.Router();

login.post("/api/login", loginController)

export default login;