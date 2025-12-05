const router = require('express').Router();
const announcementController = require('../controllers/memberController');   
const authorization = require('../middleware/authorization');

router.get('/', authorization, announcementController.getAllMembers);
router.post('/', authorization, announcementController.createMember); // Admin only

module.exports = router;