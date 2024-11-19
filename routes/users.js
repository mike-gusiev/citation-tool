const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.getCurrentUser);
router.post('/addCredit', authMiddleware, userController.addCredit)
router.get('/tasks', authMiddleware, userController.getUserTasks);

module.exports = router