const { CommonException } = require('../exceptions/commonExceptions');

const handleGrpcError = (error, callback) => {
    if (error instanceof CommonException) {
        return callback({
            code: error.errorCode,
            message: error.message,
        });
    }
    return callback({
        code: grpc.status.UNKNOWN,
        message: error.message || 'Unknown error',
    });
};

module.exports = {
    handleGrpcError
};