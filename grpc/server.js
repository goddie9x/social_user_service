const userService = require('../services/userService');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const { CommonException } = require('../exceptions/commonExceptions');

const PROTO_PATH = path.join(__dirname, '../proto/user.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const userProto = grpc.loadPackageDefinition(packageDefinition).userservice;

const protoServer = new grpc.Server();

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

const handleGrpcRequest = async (serviceMethod, request, callback) => {
    try {
        const result = await serviceMethod(request);
        return callback(null, result);
    } catch (error) {
        return handleGrpcError(error, callback);
    }
};


const startProtoServer = () => {
    const PROTO_PORT = process.env.PROTO_PORT || '0.0.0.0:50051';
    protoServer.addService(userProto.UserService.service, {
        getUsersWithPagination: (call, callback) => handleGrpcRequest(userService.getUsersWithPagination.bind(userService), call.request, callback),
        register: (call, callback) => handleGrpcRequest(UserService.register.bind(UserService), call.request, callback),
        login: (call, callback) => handleGrpcRequest(UserService.login.bind(UserService), call.request, callback),
        getUserById: (call, callback) => handleGrpcRequest(UserService.getUserById.bind(UserService), call.request, callback),
        updateUser: (call, callback) => handleGrpcRequest(UserService.updateUser.bind(UserService), call.request, callback),
        updatePassword: (call, callback) => handleGrpcRequest(UserService.updatePassword.bind(UserService), call.request, callback),
        deleteUser: (call, callback) => handleGrpcRequest(UserService.deleteUser.bind(UserService), call.request, callback),
        deleteMultipleUsers: (call, callback) => handleGrpcRequest(UserService.deleteMultipleUsers.bind(UserService), call.request, callback),
    });

    protoServer.bindAsync(PROTO_PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(`Failed to start server: ${err.message}`);
        } else {
            console.log(`Server running on port ${port}`);
        }
    });
}

module.exports = startProtoServer;
