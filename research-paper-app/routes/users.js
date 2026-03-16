const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', isAuthenticated, isAdmin, userController.getAllUsers);
router.get('/:id/edit', isAuthenticated, isAdmin, userController.getEditUser);
router.put('/:id', isAuthenticated, isAdmin, userController.putEditUser);
router.delete('/:id', isAuthenticated, isAdmin, userController.deleteUser);

module.exports = router;
