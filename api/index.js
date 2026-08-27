import express from "express";
import path from "path";
import pool from "../config/db.js";
import accept from "../routes/accept.js";
import login from "../routes/login.js";
import dashboard from "../routes/dashboard.js";

const app = express();

app.use(express.json());

// Points cleanly to root /public folder in Vercel container
const publicPath = path.join(process.cwd(), "public");

// Serve static assets (CSS, JS)
app.use(express.static(publicPath));

// HTML Page Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(publicPath, "login.html"));
});

app.get("/dashboard/panel", (req, res) => {
  res.sendFile(path.join(publicPath, "dashboard.html"));
});

// API Routes
app.use("/", accept);
app.use("/", login);
app.use("/", dashboard);

export default app;
