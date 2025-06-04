const express = require('express');
const router = express.Router();
const carRoutes = require('./car.routes');

router.use('/cars', carRoutes);

module.exports = router;
