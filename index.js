require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const router = require('./routes/index');
const startProtoServer = require('./grpc/server');
const getAuthAndPutCurrentUserAuthToBody = require('./utils/middlewares/getAuthAndPutCurrentUserAuthToBody');
const connectToDiscoveryServer = require('./utils/configs/discovery');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());
app.use(getAuthAndPutCurrentUserAuthToBody);
app.use(process.env.APP_PATH||'/api/v1/users', router);

startProtoServer();
connectToDiscoveryServer();

const server = app.listen(PORT, () => {
    console.log(`Express app listening at http://localhost:${PORT}`);
});

module.exports = { app, server };