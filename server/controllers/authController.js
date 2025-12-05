const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // <--- Import the new tool

// GENERATE TOKEN FUNCTION
const jwtGenerator = (user_id, user_role, user_name) => {
  const payload = {
    user: {
      id: user_id,
      role: user_role,
      name: user_name
    }
  };
  // Create a token that expires in 1 hour
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1hr" });
};

// REGISTER
const register = async (req, res) => {
  try {
    const { name, username, email, password, phone, department, batch } = req.body;

    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userCheck.rows.length > 0) {
      return res.status(401).json({ message: 'User already exists!' });
    }

    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = await pool.query(
      'INSERT INTO users (name, username, email, password, phone, course_department, year_level) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        name, 
        username, 
        email, 
        hashedPassword, 
        phone || null, 
        department || null, 
        batch || null,
        'member'  // Default role set to 'member'
      ]
    );

    // Generate token immediately so they are logged in after signup
    const token = jwtGenerator(newUser.rows[0].id, newUser.rows[0].role);

    res.json({ token, user: newUser.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// LOGIN (NEW!)
const login = async (req, res) => {
  try {
    // 1. Destructure data
    const { email, password } = req.body;

    // 2. Check if user doesn't exist (if not, throw error)
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Password or Email is incorrect" });
    }

    // 3. Check if incoming password matches the database password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Password or Email is incorrect" });
    }

    // 4. Give them the token
    const token = jwtGenerator(user.rows[0].id, user.rows[0].role);

    res.json({ token, user: user.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  register,
  login
};