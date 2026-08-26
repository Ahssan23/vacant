import pool from "../config/db.js";

export const dashboardService = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM properties 
    `);

    return res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });

  } catch (error) {
    console.error("Database query failed:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const dashboardPostService = async (req, res) => {
  const { title, price, location, description } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO properties (title, price, location, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, price, location, description]
    );

    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
    console.log('success in inserting')
  } catch (error) {
    console.error("Error executing query:", error);
    return res.status(500).json({
      success: false,
      message: "Database insertion failed"
    });
  }
};


export const dashboardDeleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM properties WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Property not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Property deleted successfully."
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    return res.status(500).json({ success: false, message: "Database error during deletion." });
  }
};