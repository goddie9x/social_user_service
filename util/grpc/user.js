const userMessages = require('../../generated/user_pb');

const formatGetUsersWithPaginationResponse = (result) => {
    const response = new userMessages.GetUsersWithPaginationResponse();
    response.setPage(result.page);
    response.setLimit(result.limit);
    response.setTotalUsers(result.totalUsers);
    response.setTotalPages(result.totalPages);
    
    result.users.forEach(user => {
        const userMessage = new userMessages.User();
        userMessage.setId(user.id);
        userMessage.setUsername(user.username);
        userMessage.setFirstname(user.firstName); 
        userMessage.setLastname(user.lastName); 
        userMessage.setAvatarurl(user.avatarUrl); 
        userMessage.setCoverphotourl(user.coverPhotoUrl); 
        userMessage.setRole(user.role);
        userMessage.setCreatedat(user.createdAt); 
        userMessage.setUpdatedat(user.updatedAt); 
        user.emails.forEach(email => {
            const emailMessage = new userMessages.Email();
            emailMessage.setEmail(email.email);
            emailMessage.setIsprimary(email.isPrimary);
            emailMessage.setIsverified(email.isVerified);
            userMessage.addEmails(emailMessage);
        });
        user.phones.forEach(phone => {
            const phoneMessage = new userMessages.Phone();
            phoneMessage.setNumber(phone.number);
            phoneMessage.setIsprimary(phone.isPrimary);
            phoneMessage.setIsverified(phone.isVerified);
            userMessage.addPhones(phoneMessage);
        });
        user.followerIds.forEach(followerId => {
            userMessage.addFollowerIds(followerId);
        });

        response.addUsers(userMessage);
    });
    return response;
};

const formatAuthResponse = (result) => {
    const response = new userMessages.AuthTokenResponse();
    response.setToken(result);
    return response;
};

const formatUserResponse = (result) => {
    const response = new userMessages.User();
    response.setId(result.id);
    response.setUsername(result.username);
    response.setFirstname(result.firstName); 
    response.setLastname(result.lastName); 
    response.setAvatarurl(result.avatarUrl); 
    response.setCoverphotourl(result.coverPhotoUrl); 
    response.setRole(result.role);
    response.setCreatedat(result.createdAt); 
    response.setUpdatedat(result.updatedAt); 
    result.emails?.forEach(email => {
        const emailMessage = new userMessages.Email();
        emailMessage.setEmail(email.email);
        emailMessage.setIsprimary(email.isPrimary);
        emailMessage.setIsverified(email.isVerified);
        response.addEmails(emailMessage);
    });
    result.phones?.forEach(phone => {
        const phoneMessage = new userMessages.Phone();
        phoneMessage.setNumber(phone.number);
        phoneMessage.setIsprimary(phone.isPrimary);
        phoneMessage.setIsverified(phone.isVerified);
        response.addPhones(phoneMessage);
    });
    result.followerIds?.forEach(followerId => {
        response.addFollowerIds(followerId);
    });
    return response;
};

const formatDeleteResponse = () => {
    return new userMessages.Empty();
};

const formatDeleteMultipleResponse = (result) => {
    const response = new userMessages.DeleteMultipleUsersResponse();
    response.setDeletedCount(result.deletedCount);
    return response;
};

module.exports = {
    formatAuthResponse,
    formatDeleteMultipleResponse,
    formatDeleteResponse,
    formatGetUsersWithPaginationResponse,
    formatUserResponse,
};
