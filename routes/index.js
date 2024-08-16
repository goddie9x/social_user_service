const router = require('express').Router();
const mapNormalUserRoute = require('./normalUserRoute');
const mapModUserRoute = require('./modUserRoute');

mapNormalUserRoute(router);
mapModUserRoute(router);

module.exports = router;