const userController = require('../controllers/userController');

const mapModUserRoute = (router) => {
    router.delete('/batch', userController.register);
    router.delete('/:id', userController.deleteUser);
}

module.exports = mapModUserRoute;