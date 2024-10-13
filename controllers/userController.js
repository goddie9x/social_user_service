const userService = require('../services/userService');
const BasicController = require('../utils/controllers/basicController');
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext');
class UserController extends BasicController {
    constructor() {
        super();
        bindMethodsWithThisContext(this)
    }

    async index(req, res) {
        try {
            const payloads = req.query;
            const data = await userService.getUsersWithPagination(payloads);

            return res.json(data);
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async register(req, res) {
        try {
            const {
                accessToken,
                refreshToken
            } = await userService.register(req.body);

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: process.env.REFRESH_TOKEN_MAX_AGE_MILLISECONDS
            });

            return res.status(201).json({ message: 'User registered successfully!', token: accessToken });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async login(req, res) {
        try {
            const {
                accessToken,
                refreshToken
            } = await userService.login(req.body);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: process.env.REFRESH_TOKEN_MAX_AGE_MILLISECONDS
            });

            return res.json({ token: accessToken });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async refreshToken(req, res) {
        try {
            const token = await userService.refreshToken(req.cookies);

            return res.status(200).json(token);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async logoutAllDevice(req, res) {
        try {
            await userService.clearToken(req.body);

            return res.json({ message: 'Logout all device success' });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById({ id: req.params.id });

            res.json(user);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async updateUser(req, res) {
        try {
            const payloads = { ...req.body, id: req.params.id };
            const user = await userService.updateUser(payloads);

            return res.json(user);
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async updatePassword(req, res) {
        try {
            const payloads = { ...req.body, id: req.params.id };
            await userService.updatePassword(payloads);

            return res.json({ message: 'Password updated successfully' });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async updateUserRole(req, res) {
        try {
            const payloads = { ...req.body, id: req.params.id };
            await userService.updatePassword(payloads);

            return res.json({ message: 'Role updated successfully' });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async deleteUser(req, res) {
        try {
            await userService.deleteUser({ id: req.params.id });

            return res.json({ message: 'User deleted successfully' });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async deleteMultipleUsers(req, res) {
        try {
            const deletedCount = userService.deleteMultipleUsers({ ids: req.body.ids });

            return res.json({ message: `${deletedCount} users deleted successfully` });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
}

module.exports = new UserController();
