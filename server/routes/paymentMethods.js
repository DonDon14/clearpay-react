const router = require('express').Router();
const controller = require('../controllers/paymentMethodController');
const authorization = require('../middleware/authorization');
const multer = require('multer');
const path = require('path');

// reuse storage config (or separate it if you prefer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, 'qr-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Routes
router.get('/', authorization, controller.getActiveMethods); // Public (for logged in users)
router.post('/', authorization, upload.single('qr_code'), controller.createPaymentMethod); // Admin only
router.put('/:id/status', authorization, controller.toggleStatus); // Admin only

module.exports = router;