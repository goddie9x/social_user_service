class CommonException extends Error {
    constructor(message, statusCode, errorCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.errorCode = errorCode || 'INTERNAL_SERVER_ERROR';
        Error.captureStackTrace(this, this.constructor);
    }
};

class IncorrectPermission extends CommonException {
    constructor(message, statusCode, errorCode) {
        super(message || 'Do not have permission', statusCode || 401, errorCode || 401);
    }
}

module.exports = CommonException;