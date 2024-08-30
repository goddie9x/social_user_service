const router = require('express').Router();
const mapNormalUserRoute = require('./normalUserRoute');
const mapModUserRoute = require('./modUserRoute');
const healthStatusRoute = require('../utils/eureka/healthStatusRoute');

healthStatusRoute(router);
mapNormalUserRoute(router);
mapModUserRoute(router);

module.exports = router;