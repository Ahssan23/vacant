import pool from "../config/db.js"
import bcrypt from "bcrypt";


export const acceptDataService = async(body)=>{

    const {title , price , location, description} =body
    const result = await pool.query(
        `
        INSERT INTO properties
            (title, price, location, description)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        ,[title, price, location,description]
    )




    return 'success'
}