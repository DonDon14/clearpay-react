const express = require('express');
const cors = require('cors');
const pool = require('./db');
const path = require('path'); // <--- 1. We import the path tool

const app = express();
const PORT = process.env.PORT || 5000;

// === Middleware ===
app.use(cors());
app.use(express.json());

// === 2. STATIC FOLDER CONFIGURATION (The Critical Part) ===
// This tells the server: "If anyone asks for /uploads, look in the 'uploads' folder."
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === Routes ===
app.use('/auth', require('./routes/jwtAuth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/categories', require('./routes/categories'));
app.use('/payments', require('./routes/paymentRoutes'));
app.use('/payment-methods', require('./routes/paymentMethods'));
app.use('/announcements', require('./routes/announcements'));
app.use('/members', require('./routes/members'));
app.use('/tests', require('./routes/test'));


// Database Connection Test
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL Database!');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});