const mongoose = require('../configs/db');
const USER_CONSTANTS = require('../constants/users');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '2h';

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
        type: String,
        enum: USER_CONSTANTS.ROLES,
        default: 'user'
    },
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save',async function (next) {
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
UserSchema.methods.generateAuthToken = () => {
    return jwt.sign(
        { userId: this._id, username: this.username, role: this.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
    );
}

const User = mongoose.model('User', UserSchema);

module.exports = User;