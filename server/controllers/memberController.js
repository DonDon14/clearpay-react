const pool = require('../db');
const bcrypt = require('bcrypt');

// 1. Add a new member
const createMember = async (req, res) => {
  try {
    const { name, username, email, phone, department, batch } = req.body;

    // Check if user already exists
    const userCheck = await pool.query(
      `SELECT * FROM users WHERE username = $1 OR email = $2`,[username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ msg: 'User with this username or email already exists' });
    }

    // Hash password (default: 'password123')
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users (name, username, email, phone, department, batch, role, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, username, email, phone, department, batch, 'member', hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error', err.message);
  }
};

// 2. Get all Members (For everyone to see)
const getAllMembers = async (req, res) => {
  try {
    const allMembers = await pool.query(
        `SELECT id, name, username, email, role, phone, department, batch, created_at 
         FROM users
         ORDER BY created_at DESC`
        );

    res.json(allMembers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createMember,
  getAllMembers
};