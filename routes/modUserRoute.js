const userController = require('../controllers/userController');
const { ROLES } = require('@godsocial/utils/constants/users');
const { IncorrectPermission } = require('@godsocial/utils/exceptions/commonExceptions');

// Mod routes are admin-only. The generic HMAC middleware already populated
// req.body.currentUser (or left it unset for unauthenticated callers).
const requireAdmin = (req, res, next) => {
    if (req.body.currentUser?.role !== ROLES.ADMIN) {
        return next(new IncorrectPermission('Admin only'));
    }
    next();
};

const mapModUserRoute = (router) => {
    router.delete('/batch', requireAdmin, userController.deleteMultipleUsers);
    router.patch('/role', requireAdmin, userController.updateUserRole);
    router.delete('/:id', requireAdmin, userController.deleteUser);
}

module.exports = mapModUserRoute;