/**
 * Main application file
 */

'use strict';

const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('./config/environment');
const http = require('http');

// Connect to MongoDB
mongoose.connect(config.mongo.uri, config.mongo.options);
mongoose.connection.on('error', function (err) {
  console.error(`MongoDB connection error: ${err}`);
  process.exit(-1); // eslint-disable-line no-process-exit
});

// Populate databases with sample data
if (config.seedDB) {
  require('./config/seed');
}

// Setup server
const app = express();
const server = http.createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
function startServer() {
  server.listen(config.port, config.ip, () => {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
exports = module.exports = app;
