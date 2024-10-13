const User = require('../models/user');
const mongoose = require('mongoose');
const USER_CONSTANTS = require('../utils/constants/users');
const { IncorrectPermission, TargetAlreadyExistException, TargetNotExistException, BadRequestException } = require('../utils/exceptions/commonExceptions');
const BasicService = require('../utils/services/basicService');
const connectRedis = require('../utils/redis');
const JWT_REFRESH_TOKEN_SECRET = Buffer.from(process.env.JWT_REFRESH_TOKEN_SECRET, 'base64');
const jwt = require('jsonwebtoken');
class UserService extends BasicService {
    constructor() {
        super();
        this.getPaginatedResults = this.getPaginatedResults.bind(this);
        this.getUsersWithPagination = this.getUsersWithPagination.bind(this);
    }

    async getUsersWithPagination(payloads) {
        const { username, fullName, email, page, limit } = payloads;
        const skip = (page - 1) * limit;
        const query = {
            $or: []
        };

        if (username) {
            query.$or.push({ username: new RegExp(username, 'i') });
        }

        if (fullName) {
            const [firstName, lastName] = fullName.split(' ');
            if (firstName) {
                query.$or.push({ firstName: new RegExp(firstName, 'i') });
            }
            if (lastName) {
                query.$or.push({ lastName: new RegExp(lastName, 'i') });
            }
        }

        if (email) {
            query.$or.push({ 'emails.email': new RegExp(email, 'i') });
        }

        if (query.$or.length === 0) {
            delete query.$or;
        }
        const {
            results: users, totalDocuments: totalUsers, totalPages
        } = await this.getPaginatedResults({
            model: User,
            query,
            page,
            limit
        });

        return {
            page,
            limit,
            totalUsers,
            totalPages,
            users
        }
    }
    async getListUserByIds(payloads) {
        const users = await User.find({
            _id: {
                $in: payloads.ids
            }
        });
        return { users }
    }
    async register(payloads) {
        const { username, password, email } = payloads;
        const existingUser = await User.findOne({ 'emails.email': email });

        if (existingUser) {
            throw new TargetAlreadyExistException();
        }

        const newUser = new User({
            username,
            password,
            emails: [{ email, isPrimary: true }]
        });

        await newUser.save();

        const accessToken = await newUser.generateAuthToken();
        const refreshToken = await newUser.generateRefreshTokenAndSaveIfNeeded();
        return {
            accessToken,
            refreshToken
        };
    }
    async login(payloads) {
        const { username, password } = payloads;
        const user = await User.findOne({ username });

        if (!user) {
            throw new TargetNotExistException();
        }

        const isValid = await user.validatePassword(password);

        if (!isValid) {
            throw new BadRequestException('Password incorrect');
        }

        const accessToken = await user.generateAuthToken();
        const refreshToken = await user.generateRefreshTokenAndSaveIfNeeded();

        return {
            accessToken,
            refreshToken
        };
    }
    async refreshToken(payloads) {
        let userId;
        try {
            const { refreshToken } = payloads;

            const data = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
            userId = data.userId;
        }
        catch (err) {
            console.log(err);
            throw new BadRequestException('Invalid token or token expired');
        }
        if (!userId) {
            throw new BadRequestException('Invalid token');
        }
        const user = await User.findById(userId);
        return await user.generateAuthToken();
    }
    async clearToken(payloads) {
        const { currentUser } = payloads;
        const redisClient = await connectRedis();
        const user = await User.findById(currentUser.userId);
        user.refreshToken = null;
        await user.save();
        await redisClient.del(currentUser.userId);
    }
    async getUserById(payloads) {
        const user = await User.findById(payloads.id);

        if (!user) {
            throw new TargetNotExistException();
        }
        return user;
    }
    async updateUser(payloads) {
        const { updates, currentUser, id } = payloads;
        const targetUpdateId = id;

        if (targetUpdateId != currentUser.userId && currentUser.role == USER_CONSTANTS.ROLES.USER) {
            throw new IncorrectPermission();
        }
        const { role, ...validUpdate } = updates;

        const user = await User.findByIdAndUpdate(targetUpdateId, validUpdate, { new: true });

        if (!user) {
            throw new TargetNotExistException();
        }

        return user;
    }
    async updateUserRole(payloads) {
        const { role, currentUser, id } = payloads;
        const targetUpdateId = id;
        const roleInt = parseInt(role);

        if (!Object.values(USER_CONSTANTS.ROLES).includes(roleInt)) {
            throw new TargetNotExistException('No role exist');
        }
        if (currentUser.role > roleInt) {
            throw new IncorrectPermission();
        }

        const user = await User.findByIdAndUpdate(targetUpdateId, { role: roleInt }, { new: true });

        if (!user) {
            throw new TargetNotExistException();
        }

        return user;
    }
    async updatePassword(payloads) {
        const { oldPassword, newPassword, id } = payloads;
        const user = await User.findById(id);

        if (!user) {
            throw new TargetNotExistException();
        }

        const isMatch = await user.validatePassword(oldPassword);

        if (!isMatch) {
            throw new BadRequestException('Old password is incorrect');
        }

        user.password = newPassword;
        await user.save();
    }
    async deleteUser(payloads) {
        const user = await User.findByIdAndDelete(payloads.id);

        if (!user) {
            throw new TargetNotExistException();
        }
    }
    async deleteMultipleUsers(payloads) {
        const userIds = payloads.ids;

        if (!Array.isArray(userIds) || userIds.length === 0) {
            throw new BadRequestException('No user IDs provided');
        }

        if (!userIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
            throw new BadRequestException('One or more provided IDs are invalid');
        }

        const result = await User.deleteMany({ _id: { $in: userIds } });

        if (result.deletedCount === 0) {
            throw new TargetNotExistException('No users found with the provided IDs');
        }

        return result.deletedCount;
    }
}

module.exports = new UserService();
