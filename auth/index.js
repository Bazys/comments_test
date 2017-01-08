'use strict';
const express = require('express');
const config = require('../config/environment');
const User = require('../api/user/user.model');
const passportSetup = require('./local/passport').passportSetup;

// Passport Configuration
passportSetup.setup(User, config);

let router = express.Router();

router.use('/local', require('./local'));

module.exports = router;
