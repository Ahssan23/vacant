import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.log("invalid shit")
    return res.status(401).json({ message: "Access Denied: No Token Provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "hello");
    console.log("valid shit")
    req.user = decoded;
    
    next(); 
  } catch (error) {
    console.log("invalid shit")
    return res.status(403).json({ message: "Invalid or Expired Token" });
  }
};