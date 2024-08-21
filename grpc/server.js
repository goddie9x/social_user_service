const grpc = require('@grpc/grpc-js');

const userService = require('../services/userService');
const userProto = require('../generated/user_grpc_pb');
const { handleGrpcError } = require('../util/grpc/common');
const {
    formatAuthResponse,
    formatDeleteMultipleResponse,
    formatDeleteResponse,
    formatGetUsersWithPaginationResponse,
    formatUserResponse,
} = require('../util/grpc/user');
const protoServer = new grpc.Server();


const handleGrpcRequest = async (methodName, request, callback) => {
    try {
        let formattedRequest;
        switch (methodName) {
            case 'getUsersWithPagination':
                formattedRequest = request.toObject();
                break;
            case 'register':
            case 'login':
                formattedRequest = request.toObject();
                break;
            case 'getUserById':
            case 'updateUser':
            case 'updatePassword':
            case 'deleteUser':
                formattedRequest = { id: request.getId() };
                break;
            case 'deleteMultipleUsers':
                formattedRequest = { ids: request.getIdsList() };
                break;
            default:
                throw new Error(`Unsupported method name: ${methodName}`);
        }

        const serviceMethod = userService[methodName].bind(userService);
        const result = await serviceMethod(formattedRequest);

        let response;
        switch (methodName) {
            case 'getUsersWithPagination':
                response = formatGetUsersWithPaginationResponse(result);
                break;
            case 'register':
            case 'login':
                response = formatAuthResponse(result);
                break;
            case 'getUserById':
                response = formatUserResponse(result);
                break;
            case 'updateUser':
            case 'updatePassword':
                response = formatUserResponse(result);
                break;
            case 'deleteUser':
                response = formatDeleteResponse(result);
                break;
            case 'deleteMultipleUsers':
                response = formatDeleteMultipleResponse(result);
                break;
            default:
                throw new Error(`Unsupported method name: ${methodName}`);
        }

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
            console.log(`Server running on port ${port}`);
        }
    });
};

module.exports = startProtoServer;
