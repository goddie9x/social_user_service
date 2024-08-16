const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/',userController.index);
router.post('/login',userController.login);
router.post('/register',userController.register);
router.get('/profile/:id',userController.getUserById);
router.post('/update-password',userController.updatePassword);
router.patch('/update',userController.updateUser);
router.delete('/batch',userController.register);
router.delete('/:id',userController.deleteUser);

module.exports = router;