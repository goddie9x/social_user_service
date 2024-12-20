const mongoose = require('../configs/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const USER_CONSTANTS = require('../utils/constants/users');
const connectRedis = require('../utils/redis')

const Schema = mongoose.Schema;
const JWT_ACCESS_TOKEN_SECRET = Buffer.from(process.env.JWT_ACCESS_TOKEN_SECRET, 'base64');
const JWT_REFRESH_TOKEN_SECRET = Buffer.from(process.env.JWT_REFRESH_TOKEN_SECRET, 'base64');
const JWT_ACCESS_TOKEN_EXPIRE = process.env.JWT_ACCESS_TOKEN_EXPIRE || '2h';
const JWT_REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_TOKEN_EXPIRE || '7d';
const REDIS_TOKEN_EXPIRE_SECONDS = 7190;
const rolesArray = Object.values(USER_CONSTANTS.ROLES);

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    emails: [{
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    }],
    phones: [{
        number: {
            type: String,
            trim: true
        },
        isPrimary: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    }],
    avatarUrl: {
        type: String,
        trim: true
    },
    coverPhotoUrl: {
        type: String,
        trim: true
    },
    role: {
        type: Number,
        enum: rolesArray,
        default: USER_CONSTANTS.ROLES.USER
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    refreshToken: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.index({ username: 1, role: 1 });

UserSchema.index({ "emails.email": 1, "emails.isPrimary": 1, "emails.isVerified": 1 });

UserSchema.index({ "phones.number": 1, "phones.isPrimary": 1, "phones.isVerified": 1 });

UserSchema.index({ followers: 1, createdAt: -1 });

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    if (!this.isModified('updatedAt')) {
        this.updatedAt = Date.now();
    }
    next();
});

UserSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
UserSchema.methods.generateAuthToken = async function () {
    const userId = this._id.toString();
    const payloads = { userId, username: this.username, role: this.role };
    let token;
    const redisClient = await connectRedis();
    try {
        token = await redisClient.get(userId);
    }
    catch (e) {
        console.log("get token from redis failed", e);
    }
    if (!token) {
        token = jwt.sign(
            payloads,
            JWT_ACCESS_TOKEN_SECRET,
            { algorithm: 'HS256', expiresIn: JWT_ACCESS_TOKEN_EXPIRE }
        );
        await redisClient.set(userId, token, { EX: REDIS_TOKEN_EXPIRE_SECONDS });
    }
    return token;
}
UserSchema.methods.generateRefreshTokenAndSaveIfNeeded = async function (params) {
    const currentRefreshToken = this.refreshToken;

    if (currentRefreshToken) {
        try {
            jwt.verify(currentRefreshToken, JWT_REFRESH_TOKEN_SECRET);
            return currentRefreshToken; 
        } catch (error) {
            console.log("Existing refresh token is invalid or expired", err.message);
        }
    }
    const newRefreshToken = jwt.sign(
        { userId: this._id },
        JWT_REFRESH_TOKEN_SECRET,
        { algorithm: 'HS256', expiresIn: JWT_REFRESH_TOKEN_EXPIRE }
    );
    this.refreshToken = newRefreshToken;
    await this.save();
    return newRefreshToken;
}

const User = mongoose.model('User', UserSchema);

module.exports = User;