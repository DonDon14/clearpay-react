const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization'); // <--- Import the Bouncer

// We add 'authorization' as the second argument. This means:
// "Run the Bouncer check FIRST. If it passes, run the function."
router.get('/', authorization, async (req, res) => {
  try {
    // req.user comes from the middleware!
    // We select everything EXCEPT the password
    const user = await pool.query(
      'SELECT id, name, username, email, phone, department, batch, role FROM users WHERE id = $1',
      [req.user.id]
    );

    res.json(user.rows[0]);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).json('Server Error');
  }
});

module.exports = router;