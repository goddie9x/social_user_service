const getAuthAndPutCurrentUserAuthToBody = (req, res, next) => {
    const currentUserJson = req.headers['x-current-user'];
if (currentUserJson) {
    try {
        const currentUser = JSON.parse(currentUserJson);

        req.body.currentUser = currentUser;
    } catch (e) {
        console.error('Failed to parse X-Current-User header:', e);
    }
}

    next();
}

module.exports = getAuthAndPutCurrentUserAuthToBody;