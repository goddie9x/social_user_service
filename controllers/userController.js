const User = require('../models/user');
const mongoose = require('mongoose');

class UserController {
    async index(req, res) {
        try {
            const { username, fullname, email, page, limit } = req.query;
            const skip = (page - 1) * limit;
            const query = {
                $or: []
            };

            if (username) {
                query.$or.push({ username: new RegExp(username, 'i') });
            }

            if (fullname) {
                const [firstName, lastName] = fullname.split(' ');
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

            res.json({
                page,
                limit,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                users
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async register(req, res) {
        try {
            const { username, password, email } = req.body;
            const existingUser = await User.findOne({ 'emails.email': email });

            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use.' });
            }

            const newUser = new User({
                username,
                password,
                emails: [{ email, isPrimary: true }]
            });

            await newUser.save();

            const token = newUser.generateAuthToken();

            res.status(201).json({ message: 'User registered successfully!', token });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });

            if (!user) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const isValid = await user.validatePassword(password);

            if (!isValid) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const token = user.generateAuthToken();
            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    }
    async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const { password, ...userPublicInfo } = user;
            res.json(userPublicInfo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateUser(req, res) {
        try {
            const updates = req.body;
            const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async updatePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isMatch = await user.validatePassword(oldPassword);

            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is incorrect' });
            }

            user.password = newPassword;
            await user.save();

            res.json({ message: 'Password updated successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async deleteMultipleUsers(req, res) {
        try {
            const userIds = req.body.ids;

            if (!Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({ message: 'No user IDs provided' });
            }

            if (!userIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
                return res.status(400).json({ message: 'One or more provided IDs are invalid' });
            }

            const result = await User.deleteMany({ _id: { $in: userIds } });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'No users found with the provided IDs' });
            }

            res.json({ message: `${result.deletedCount} users deleted successfully` });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new UserController();
