const pool = require('../db');

// 1. Create Method (Admin)
const createPaymentMethod = async (req, res) => {
  try {
    const { name, account_name, account_number, instructions } = req.body;
    const qr_code_file = req.file ? req.file.filename : null; // Get image from Multer

    const newMethod = await pool.query(
      `INSERT INTO payment_methods (name, account_name, account_number, qr_code_file, instructions) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, account_name, account_number, qr_code_file, instructions]
    );

    res.json(newMethod.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. Get All Active Methods (For Members to see)
const getActiveMethods = async (req, res) => {
  try {
    const methods = await pool.query('SELECT * FROM payment_methods WHERE is_active = true ORDER BY id ASC');
    res.json(methods.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 3. Toggle Status (Soft Delete / Hide)
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    await pool.query('UPDATE payment_methods SET is_active = $1 WHERE id = $2', [is_active, id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = { createPaymentMethod, getActiveMethods, toggleStatus };