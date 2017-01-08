/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
const User = require('../api/user/user.model');

User.find({}).remove()
  .then(() => {
    User.create(
      {
        provider: 'local',
        role: 'admin',
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin'
      },
      {
        provider: 'local',
        name: 'Test User',
        email: 'test@example.com',
        password: 'test'
      })
      .then(() => {
        console.log('finished populating users');
      });
  });
