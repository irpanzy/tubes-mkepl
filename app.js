const express = require('express');
const app = express();
const routes = require('./routes');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use('/api/v1', routes);

module.exports = app;
