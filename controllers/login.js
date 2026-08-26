import { loginService } from "../services/login.js";



export const loginController = async(req,res)=>{
     const result = await loginService(req.body, res);
     
     return res.json(result);

}