const userController = require('../controllers/userController');

const mapNormalUserRoute = (router) => {
    router.get('/', userController.index);
    router.post('/login', userController.login);
    router.post('/register', userController.register);
    router.get('/profile/:id', userController.getUserById);
    router.post('/update-password', userController.updatePassword);
    router.patch('/update', userController.updateUser);
}

module.exports = mapNormalUserRoute;