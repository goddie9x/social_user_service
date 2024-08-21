const User = require('../models/user');
const mongoose = require('mongoose');

const USER_CONSTANTS = require('../constants/users');
const { IncorrectPermission,TargetAlreadyExistException,TargetNotExistException, BadRequestException } = require('../util/exceptions/commonExceptions');

class UserService {
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

        const users = await User.find(query).skip(skip).limit(limit);
        const totalUsers = await User.countDocuments(query);

        return {
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users
        }
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

        const token = newUser.generateAuthToken();

        return token;
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

        const token = user.generateAuthToken();
        return token;
    }
    async getUserById(payloads) {
        const user = await User.findById(payloads.id);

        if (!user) {
            throw new TargetNotExistException();
        }

        return user;
    }
    async updateUser(payloads) {
        const { updates, currentUser,id } = payloads.body;
        const targetUpdateId = id;

        if (!currentUser.userId || targetUpdateId != currentUser.userId && currentUser.role == USER_CONSTANTS.ROLES.user) {
            throw new IncorrectPermission();
        }

        const user = await User.findByIdAndUpdate(targetUpdateId, updates, { new: true });

        if (!user) {
            throw new TargetNotExistException();
        }

        return user;
    }
    async updatePassword(payloads) {
        const { oldPassword, newPassword,id } = payloads.body;
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
