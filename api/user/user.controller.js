'use strict';

const User = require('./user.model');
const config = require('../../config/environment');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

class UserConstroller {

  static _validationError(res, statusCode) {
    statusCode = statusCode || 422;
    return err => res.status(statusCode).json(err);
  }

  static _handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return err => res.status(statusCode).send(err);
  }

  /**
   * Get list of users
   * restriction: 'admin'
   */
  index(req, res) {
    return User.find({}, '-salt -password -token').exec()
      .then(users => {
        res.status(200).json(users);
      })
      .catch(UserConstroller._handleError(res));
  }

  /**
   * Get list of users with comments count
   */
  listWithComments(req, res) {
    let size = Number(req.query.size) || 3000;
    return User.find({}, '-salt -password -profile -token -_id')
      .limit(size)
      .populate({ path: 'comments', select: 'creator_id -_id' })
      .exec()
      .then(users => {
        let results = [];
        for (let user of users) {
          let usr = {};
          usr.name = user.name;
          usr.commentsCount = user.comments.length;
          results.push(usr);
        }
        return res.status(200).json(_.sortBy(results, 'commentsCount').reverse());
      })
      .catch(UserConstroller._handleError(res));
  }

  /**
   * Creates a new user
   */
  create(req, res) {
    let newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save()
      .then(user => {
        let token = jwt.sign({ _id: user._id }, config.secrets.session, {
          expiresIn: 60 * 60 * 5
        });
        res.json({ token });
      })
      .catch(UserConstroller._validationError(res));
  }

  /**
   * Get a single user
   */
  show(req, res, next) {
    let userId = req.params.id;

    return User.findById(userId).exec()
      .then(user => {
        if (!user) {
          return res.sendStatus(404);
        }
        res.json(user.profile);
      })
      .catch(err => next(err));
  }

  /**
   * Deletes a user
   * restriction: 'admin'
   */
  destroy(req, res) {
    return User.findByIdAndRemove(req.params.id).exec()
      .then(() => res.sendStatus(204))
      .catch(UserConstroller._handleError(res));
  }

  /**
   * Change a users password
   */
  changePassword(req, res) {
    let userId = req.user._id;
    let oldPass = String(req.body.oldPassword);
    let newPass = String(req.body.newPassword);

    return User.findById(userId).exec()
      .then(user => {
        if (user.authenticate(oldPass)) {
          user.password = newPass;
          return user.save()
            .then(() => {
              res.sendStatus(204);
            })
            .catch(UserConstroller._validationError(res));
        } else {
          return res.senStatus(403);
        }
      });
  }

  /**
   * Get my info
   */
  me(req, res, next) {
    let userId = req.user._id;

    return User.findOne({ _id: userId }, '-salt -password').exec() // don't ever give out the password or salt
      .then(user => {
        if (!user) {
          return res.status(401).end();
        }
        res.json(user);
      })
      .catch(err => next(err));
  }

  /**
   * Authentication callback
   */
  authCallback(req, res) {
    res.redirect('/');
  }
}
const controller = new UserConstroller();
module.exports = controller;
