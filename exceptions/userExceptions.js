const CommonException = require('./commonExceptions');

class UserNotExistException extends CommonException {
    constructor(message, statusCode, errorCode) {
        super(message || 'User not exist', statusCode || 400, errorCode || 400);
    }
}

class UserAlreadyExistException extends Error {
    constructor(message, statusCode, errorCode) {
        super(message || 'User already exist', statusCode || 400, errorCode || 400);
    }
}

module.exports = {
    UserNotExistException,
    UserAlreadyExistException
}