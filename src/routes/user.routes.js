const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const userController = require('../controller/user.controller');

const isSuperAdmin = checkRole(['SUPER_ADMIN']);

router.get('/', authenticate, isSuperAdmin, userController.getAllUsers);
router.get('/:id', authenticate, isSuperAdmin, userController.getUserById);
router.post('/', authenticate, isSuperAdmin, userController.createUser);
router.put('/:id', authenticate, isSuperAdmin, userController.updateUser);
router.delete('/:id', authenticate, isSuperAdmin, userController.deleteUser);

module.exports = router;