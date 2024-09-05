const grpc = require('@grpc/grpc-js');

const userService = require('../services/userService');
const userProto = require('../generated/user_grpc_pb');
const userMessages = require('../generated/user_pb')
const { handleGrpcError } = require('../utils/grpc/common');
const {
    formatAuthResponse,
    formatDeleteMultipleResponse,
    formatDeleteResponse,
    formatGetUsersWithPaginationResponse,
    formatUserResponse,
    formatGetListUserByIdsResponse,
} = require('./formatResponse');
const protoServer = new grpc.Server();

const handleGrpcFormatRequest = (methodName, request) => {
    switch (methodName) {
        case 'getUsersWithPagination':
        case 'register':
        case 'login':
            return request.toObject();
        case 'getUserById':
        case 'updateUser':
        case 'updatePassword':
        case 'deleteUser':
            return { id: request.getId() };
        case 'deleteMultipleUsers':
        case 'getListUserByIds':
            return { ids: request.getIdsList() };
        default:
            throw new Error(`Unsupported method name: ${methodName}`);
    }
}

const handleGrpcFormatResponse = (methodName, result) => {
    switch (methodName) {
        case 'getUsersWithPagination':
            return formatGetUsersWithPaginationResponse(result, userMessages);
        case 'getListUserByIds':
            return formatGetListUserByIdsResponse(result, userMessages);
        case 'register':
        case 'login':
            return formatAuthResponse(result, userMessages);
        case 'getUserById':
            return formatUserResponse(result, userMessages);
        case 'updateUser':
        case 'updatePassword':
            return formatUserResponse(result, userMessages);
        case 'deleteUser':
            return formatDeleteResponse(result, userMessages);
        case 'deleteMultipleUsers':
            return formatDeleteMultipleResponse(result, userMessages);
        default:
            throw new Error(`Unsupported method name: ${methodName}`);
    }
}

const handleGrpcRequest = async (methodName, request, callback) => {
    try {
        const formattedRequest = handleGrpcFormatRequest(methodName, request);
        const serviceMethod = userService[methodName].bind(userService);
        const result = await serviceMethod(formattedRequest);
        const response = handleGrpcFormatResponse(methodName, result);

        return callback(null, response);
    } catch (error) {
        console.log(error);
        return handleGrpcError(error, callback);
    }
};

const startProtoServer = () => {
    const PROTO_PORT = process.env.PROTO_PORT || '0.0.0.0:50051';

    protoServer.addService(userProto.UserServiceService, {
        getUsersWithPagination: (call, callback) =>
            handleGrpcRequest('getUsersWithPagination', call.request, callback),
        getListUserByIds: (call, callback) =>
            handleGrpcRequest('getListUserByIds', call.request, callback),
        register: (call, callback) =>
            handleGrpcRequest('register', call.request, callback),
        login: (call, callback) =>
            handleGrpcRequest('login', call.request, callback),
        getUserById: (call, callback) =>
            handleGrpcRequest('getUserById', call.request, callback),
        updateUser: (call, callback) =>
            handleGrpcRequest('updateUser', call.request, callback),
        updatePassword: (call, callback) =>
            handleGrpcRequest('updatePassword', call.request, callback),
        deleteUser: (call, callback) =>
            handleGrpcRequest('deleteUser', call.request, callback),
        deleteMultipleUsers: (call, callback) =>
            handleGrpcRequest('deleteMultipleUsers', call.request, callback),
    });

    protoServer.bindAsync(PROTO_PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
        if (err) {
            console.error(`Failed to start server: ${err.message}`);
        } else {
            console.log(`GRPC server running on port ${port}`);
        }
    });
};

module.exports = startProtoServer;
