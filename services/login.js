import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginService = async (body,res) => {
  const result = await pool.query(
    `
        SELECT id, username, password_hash 
        FROM admins 
        WHERE username = $1;
        `,
    [body.username],
  );


  const compare = await bcrypt.compare(body.password,result.rows[0].password_hash);

  if(compare === true){
    const JWT_SECRET = "hello"
    const data = {loggedIn:true};

    const token =  jwt.sign(data,JWT_SECRET,{expiresIn:'1h'})
    return {status:200, token:token};
  }else{
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
};


