const request = require('supertest');
const { app, server } = require('../../index');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');

jest.mock('jsonwebtoken');
jest.mock('bcrypt');
jest.mock('../../models/user');

describe('UserController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.runAllTimers();
        jest.useRealTimers();
    });
    afterAll(done => {
        server.close(done);
    });
    describe('POST /register', () => {
        it('should register a new user and return a JWT token', async () => {
            const mockUser = {
                _id: 'testUserId',
                username: 'testuser',
                password: 'hashedPassword',
                emails: [{ email: 'test@example.com', isPrimary: true }],
                save: jest.fn().mockResolvedValue(true),
                generateAuthToken: jest.fn().mockReturnValue('mockToken')
            };

            User.findOne = jest.fn().mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue(mockUser);

            jwt.sign = jest.fn().mockReturnValue('mockToken');

            const response = await request(app)
                .post('/api/v1/users/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    email: 'test@example.com'
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: 'User registered successfully!',
                token: 'mockToken'
            });
            expect(User.findOne).toHaveBeenCalledWith({ 'emails.email': 'test@example.com' });
            expect(User.prototype.save).toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser._id, username: mockUser.username },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE || '2h' }
            );
        });

        it('should return 400 if email is already in use', async () => {
            User.findOne = jest.fn().mockResolvedValue({});

            const response = await request(app)
                .post('/api/v1/users/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                    email: 'test@example.com'
                });

            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Email already in use.' });
        });
    });
    describe('POST /login', () => {
        it('should login a user and return a JWT token', async () => {
            const mockUser = {
                _id: 'testUserId',
                username: 'testuser',
                password: 'hashedPassword',
                validatePassword: jest.fn().mockResolvedValue(true),
                generateAuthToken: jest.fn().mockReturnValue('mockToken')
            };

            User.findOne = jest.fn().mockResolvedValue(mockUser);

            jwt.sign = jest.fn().mockReturnValue('mockToken'); // Mock JWT token

            const response = await request(app)
                .post('/api/v1/users/login')
                .send({
                    username: 'testuser',
                    password: 'password123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                token: 'mockToken'
            });
            expect(User.findOne).toHaveBeenCalledWith({ username: 'testuser' });
            expect(mockUser.validatePassword).toHaveBeenCalledWith('password123');
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it('should return 401 if invalid username or password', async () => {
            User.findOne = jest.fn().mockResolvedValue(null); // No user found

            const response = await request(app)
                .post('/api/v1/users/login')
                .send({
                    username: 'testuser',
                    password: 'wrongPassword'
                });

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ message: 'Invalid username or password' });
        });
    });
});
