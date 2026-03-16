const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/multer');

router.get('/', isAuthenticated, profileController.getProfile);
router.put('/', isAuthenticated, uploadProfile.single('profilePicture'), profileController.putProfile);
router.put('/password', isAuthenticated, profileController.putPassword);

module.exports = router;
