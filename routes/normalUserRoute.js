const userController = require('../controllers/userController');

const mapNormalUserRoute = (router) => {
    router.get('/', userController.index);
    router.post('/login', userController.login);
    router.post('/register', userController.register);
    router.get('/refresh-token', userController.refreshToken);
    router.get('/profile/:id', userController.getUserById);
    router.patch('/update-password/:id', userController.updatePassword);
    router.patch('/update/:id', userController.updateUser);
    router.delete('/logout-all', userController.logoutAllDevice);
}

module.exports = mapNormalUserRoute;