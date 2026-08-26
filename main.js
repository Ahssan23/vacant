import express from "express";
import pool from "./config/db.js";
import accept from "./routes/accept.js";
import { fileURLToPath } from 'url';
import path from "path";
import login from "./routes/login.js";
import bcrypt from "bcrypt";
import dashboard from "./routes/dashboard.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve dashboard.html when users hit http://localhost:3000/dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));   
});
app.get("/dashboard/panel", (req,res)=>{
  res.sendFile(path.join(__dirname,'public', 'dashboard.html'));
})



app.use("/", accept)
app.use("/", login)
app.use("/", dashboard)

export default app;


