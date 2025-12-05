const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const authorization = require('../middleware/authorization');

// Public Route: Anyone can see the list of fees
router.get('/', categoryController.getAllCategories);

// Private Route: Only Admins can create fees
// We will add a role check inside the controller later, or trust the frontend for now (Simple version)
router.post('/', authorization, categoryController.createCategory);
// Private Route: Only Admins can update fees
router.put('/:id', authorization, categoryController.updateCategory);
// Private Route: Only Admins can delete fees
router.delete('/:id', authorization, categoryController.deleteCategory);

module.exports = router;