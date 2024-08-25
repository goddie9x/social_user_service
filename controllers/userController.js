const { CommonException } = require('../utils/exceptions/commonExceptions');
const userService = require('../services/userService');
const BasicController = require('../utils/controllers/basicController');
class UserController extends BasicController {
    constructor() {
        super();
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.getUserById = this.getUserById.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteMultipleUsers = this.deleteMultipleUsers.bind(this);
    }

    async index(req, res) {
        try {
            const payloads = req.query;
            const data = await userService.getUsersWithPagination(req);

            return res.json(data);
        } catch (error) {
            this.handleResponseError(res, error);
        }
    }
    async register(req, res) {
        try {
            const token = await userService.register(req.body);

            return res.status(201).json({ message: 'User registered successfully!', token });
        } catch (error) {
            return this.handleResponseError(res, error);
        }
    }
    async login(req, res) {
        try {
            const token = await userService.login(req.body);

            return res.json({ token });
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
