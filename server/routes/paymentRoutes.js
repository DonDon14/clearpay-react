const router = require('express').Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');
const multer = require('multer');
const path = require('path');

// === MULTER CONFIGURATION ===
// 1. Where to save the file?
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save to the 'uploads' folder we just created
  },
  filename: (req, file, cb) => {
    // 2. What to name the file? (We add the date to avoid duplicate names)
    // Example: proof-123456789.png
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'proof-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// === THE UPLOAD ROUTE ===
// We expect a file field named 'proof'
router.post('/', authorization, upload.single('proof'), async (req, res) => {
  try {
    // 1. Get text data
    const { category_id, amount, reference_code } = req.body;
    
    // 2. Get the filename (Multer added this to req.file)
    const proof_file = req.file ? req.file.filename : null;

    if (!proof_file) {
      return res.status(400).json({ message: 'Please upload a proof of payment image' });
    }

    // 3. Save to Database
    const newPayment = await pool.query(
      `INSERT INTO payments (user_id, category_id, amount, reference_code, proof_file, status) 
       VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *`,
      [req.user.id, category_id, amount, reference_code, proof_file]
    );

    res.json({ message: 'Payment Submitted!', payment: newPayment.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// === ADMIN: Manually Record a Payment ===
// We use the same 'upload' middleware in case Admin wants to attach a receipt photo
router.post('/create', authorization, upload.single('proof'), async (req, res) => {
  try {
    // 1. Get data (Admin provides user_id manually)
    const { user_id, category_id, amount, reference_code } = req.body;
    
    // 2. File is optional for Admin (Cash payments might not have a photo)
    const proof_file = req.file ? req.file.filename : null;

    // 3. Insert as 'approved' instantly
    const newPayment = await pool.query(
      `INSERT INTO payments (user_id, category_id, amount, reference_code, proof_file, status) 
       VALUES ($1, $2, $3, $4, $5, 'approved') RETURNING *`,
      [user_id, category_id, amount, reference_code || 'CASH', proof_file]
    );

    res.json({ message: 'Payment Recorded Successfully!', payment: newPayment.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// === GET MY PAYMENTS (History) ===
router.get('/my-history', authorization, async (req, res) => {
  try {
    const history = await pool.query(
      `SELECT p.*, c.name as category_name 
       FROM payments p
       JOIN contribution_categories c ON p.category_id = c.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    res.json(history.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// === ADMIN: Get All Payments ===
router.get('/all', authorization, async (req, res) => {
  try {
    // We join with users table to see WHO paid
    const allPayments = await pool.query(
      `SELECT p.*, u.name as user_name, u.department, u.batch, c.name as category_name
       FROM payments p
       JOIN users u ON p.user_id = u.id
       JOIN contribution_categories c ON p.category_id = c.id
       ORDER BY p.created_at DESC`
    );
    res.json(allPayments.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// === ADMIN: Approve or Reject ===
router.put('/:id/status', authorization, async (req, res) => {
  try {
    const { id } = req.params; // Get payment ID from URL
    const { status } = req.body; // Get new status (approved/rejected)

    const updatePayment = await pool.query(
      'UPDATE payments SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (updatePayment.rows.length === 0) {
      return res.status(404).json('Payment not found');
    }

    res.json({ message: `Payment ${status}!`, payment: updatePayment.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;