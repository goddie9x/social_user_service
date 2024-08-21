// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var user_pb = require('./user_pb.js');

function serialize_userservice_AuthTokenResponse(arg) {
  if (!(arg instanceof user_pb.AuthTokenResponse)) {
    throw new Error('Expected argument of type userservice.AuthTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_AuthTokenResponse(buffer_arg) {
  return user_pb.AuthTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_DeleteMultipleUsersRequest(arg) {
  if (!(arg instanceof user_pb.DeleteMultipleUsersRequest)) {
    throw new Error('Expected argument of type userservice.DeleteMultipleUsersRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_DeleteMultipleUsersRequest(buffer_arg) {
  return user_pb.DeleteMultipleUsersRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_DeleteMultipleUsersResponse(arg) {
  if (!(arg instanceof user_pb.DeleteMultipleUsersResponse)) {
    throw new Error('Expected argument of type userservice.DeleteMultipleUsersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_DeleteMultipleUsersResponse(buffer_arg) {
  return user_pb.DeleteMultipleUsersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_DeleteUserRequest(arg) {
  if (!(arg instanceof user_pb.DeleteUserRequest)) {
    throw new Error('Expected argument of type userservice.DeleteUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_DeleteUserRequest(buffer_arg) {
  return user_pb.DeleteUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_Empty(arg) {
  if (!(arg instanceof user_pb.Empty)) {
    throw new Error('Expected argument of type userservice.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_Empty(buffer_arg) {
  return user_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_GetUserByIdRequest(arg) {
  if (!(arg instanceof user_pb.GetUserByIdRequest)) {
    throw new Error('Expected argument of type userservice.GetUserByIdRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_GetUserByIdRequest(buffer_arg) {
  return user_pb.GetUserByIdRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_GetUsersWithPaginationRequest(arg) {
  if (!(arg instanceof user_pb.GetUsersWithPaginationRequest)) {
    throw new Error('Expected argument of type userservice.GetUsersWithPaginationRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_GetUsersWithPaginationRequest(buffer_arg) {
  return user_pb.GetUsersWithPaginationRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_GetUsersWithPaginationResponse(arg) {
  if (!(arg instanceof user_pb.GetUsersWithPaginationResponse)) {
    throw new Error('Expected argument of type userservice.GetUsersWithPaginationResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_GetUsersWithPaginationResponse(buffer_arg) {
  return user_pb.GetUsersWithPaginationResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_LoginRequest(arg) {
  if (!(arg instanceof user_pb.LoginRequest)) {
    throw new Error('Expected argument of type userservice.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_LoginRequest(buffer_arg) {
  return user_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_RegisterRequest(arg) {
  if (!(arg instanceof user_pb.RegisterRequest)) {
    throw new Error('Expected argument of type userservice.RegisterRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_RegisterRequest(buffer_arg) {
  return user_pb.RegisterRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_UpdatePasswordRequest(arg) {
  if (!(arg instanceof user_pb.UpdatePasswordRequest)) {
    throw new Error('Expected argument of type userservice.UpdatePasswordRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_UpdatePasswordRequest(buffer_arg) {
  return user_pb.UpdatePasswordRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_UpdateUserRequest(arg) {
  if (!(arg instanceof user_pb.UpdateUserRequest)) {
    throw new Error('Expected argument of type userservice.UpdateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_UpdateUserRequest(buffer_arg) {
  return user_pb.UpdateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_userservice_User(arg) {
  if (!(arg instanceof user_pb.User)) {
    throw new Error('Expected argument of type userservice.User');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_userservice_User(buffer_arg) {
  return user_pb.User.deserializeBinary(new Uint8Array(buffer_arg));
}


var UserServiceService = exports.UserServiceService = {
  getUsersWithPagination: {
    path: '/userservice.UserService/GetUsersWithPagination',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.GetUsersWithPaginationRequest,
    responseType: user_pb.GetUsersWithPaginationResponse,
    requestSerialize: serialize_userservice_GetUsersWithPaginationRequest,
    requestDeserialize: deserialize_userservice_GetUsersWithPaginationRequest,
    responseSerialize: serialize_userservice_GetUsersWithPaginationResponse,
    responseDeserialize: deserialize_userservice_GetUsersWithPaginationResponse,
  },
  register: {
    path: '/userservice.UserService/Register',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.RegisterRequest,
    responseType: user_pb.AuthTokenResponse,
    requestSerialize: serialize_userservice_RegisterRequest,
    requestDeserialize: deserialize_userservice_RegisterRequest,
    responseSerialize: serialize_userservice_AuthTokenResponse,
    responseDeserialize: deserialize_userservice_AuthTokenResponse,
  },
  login: {
    path: '/userservice.UserService/Login',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.LoginRequest,
    responseType: user_pb.AuthTokenResponse,
    requestSerialize: serialize_userservice_LoginRequest,
    requestDeserialize: deserialize_userservice_LoginRequest,
    responseSerialize: serialize_userservice_AuthTokenResponse,
    responseDeserialize: deserialize_userservice_AuthTokenResponse,
  },
  getUserById: {
    path: '/userservice.UserService/GetUserById',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.GetUserByIdRequest,
    responseType: user_pb.User,
    requestSerialize: serialize_userservice_GetUserByIdRequest,
    requestDeserialize: deserialize_userservice_GetUserByIdRequest,
    responseSerialize: serialize_userservice_User,
    responseDeserialize: deserialize_userservice_User,
  },
  updateUser: {
    path: '/userservice.UserService/UpdateUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UpdateUserRequest,
    responseType: user_pb.User,
    requestSerialize: serialize_userservice_UpdateUserRequest,
    requestDeserialize: deserialize_userservice_UpdateUserRequest,
    responseSerialize: serialize_userservice_User,
    responseDeserialize: deserialize_userservice_User,
  },
  updatePassword: {
    path: '/userservice.UserService/UpdatePassword',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.UpdatePasswordRequest,
    responseType: user_pb.Empty,
    requestSerialize: serialize_userservice_UpdatePasswordRequest,
    requestDeserialize: deserialize_userservice_UpdatePasswordRequest,
    responseSerialize: serialize_userservice_Empty,
    responseDeserialize: deserialize_userservice_Empty,
  },
  deleteUser: {
    path: '/userservice.UserService/DeleteUser',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.DeleteUserRequest,
    responseType: user_pb.Empty,
    requestSerialize: serialize_userservice_DeleteUserRequest,
    requestDeserialize: deserialize_userservice_DeleteUserRequest,
    responseSerialize: serialize_userservice_Empty,
    responseDeserialize: deserialize_userservice_Empty,
  },
  deleteMultipleUsers: {
    path: '/userservice.UserService/DeleteMultipleUsers',
    requestStream: false,
    responseStream: false,
    requestType: user_pb.DeleteMultipleUsersRequest,
    responseType: user_pb.DeleteMultipleUsersResponse,
    requestSerialize: serialize_userservice_DeleteMultipleUsersRequest,
    requestDeserialize: deserialize_userservice_DeleteMultipleUsersRequest,
    responseSerialize: serialize_userservice_DeleteMultipleUsersResponse,
    responseDeserialize: deserialize_userservice_DeleteMultipleUsersResponse,
  },
};

exports.UserServiceClient = grpc.makeGenericClientConstructor(UserServiceService);
