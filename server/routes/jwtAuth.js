const router = require('express').Router(); // Get the router tool from Express
const authController = require('../controllers/authController'); // Import our Chef (Controller)

// THE ROUTE:
// 1. It listens for a POST request.
// 2. The path is '/register'.
// 3. It executes the 'register' function from our controller.
router.post('/register', authController.register);
router.post('/login', authController.login); // NEW LOGIN ROUTE

module.exports = router;