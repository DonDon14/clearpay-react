const router = require('express').Router();
const announcementController = require('../controllers/announcementController');   
const authorization = require('../middleware/authorization');

// Public Route: Anyone can see announcements
router.get('/', announcementController.getAllAnnouncements);

router.post('/', authorization, announcementController.createAnnouncement);

router.put('/:id', authorization, announcementController.updateAnnouncement);

router.delete('/:id', authorization, announcementController.deleteAnnouncement);

module.exports = router;