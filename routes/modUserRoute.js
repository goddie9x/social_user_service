const userController = require('../controllers/userController');

const mapModUserRoute = (router) => {
    router.delete('/batch', userController.deleteMultipleUsers);
    router.patch('/role', userController.deleteMultipleUsers);
    router.delete('/:id', userController.deleteUser);
}

module.exports = mapModUserRoute;