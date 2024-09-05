const formatGetUsersWithPaginationResponse = (result, userMessages) => {
    const response = new userMessages.GetUsersWithPaginationResponse();
    response.setPage(result.page);
    response.setLimit(result.limit);
    response.setTotalUsers(result.totalUsers);
    response.setTotalPages(result.totalPages);

    result.users.forEach(user => {
        const userMessage = formatUserResponse(user,userMessages);

        response.addUsers(userMessage);
    });
    return response;
};
const formatGetListUserByIdsResponse = (result, userMessages) => {
    const response = new userMessages.GetListUserByIdsResponse();

    result.users.forEach(user => {
        const userMessage = formatUserResponse(user,userMessages);

        response.addUsers(userMessage);
    });

    return response;
}

const formatAuthResponse = (result, userMessages) => {
    const response = new userMessages.AuthTokenResponse();
    response.setToken(result);
    return response;
};

const formatUserResponse = (result, userMessages) => {
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

const formatDeleteMultipleResponse = (result, userMessages) => {
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
    formatGetListUserByIdsResponse,
};