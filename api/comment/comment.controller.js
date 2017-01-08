/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/comments              ->  index / all comments as tree
 * POST    /api/comments              ->  create
 * GET     /api/comments/:id          ->  show
 * PUT     /api/comments/:id          ->  upsert
 * PATCH   /api/comments/:id          ->  patch
 * DELETE  /api/comments/:id          ->  destroy
 */

'use strict';

const jsonpatch = require('fast-json-patch');
const Comment = require('./comment.model');
const _ = require('lodash');

class CommentController {

  static _respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return entity => {
      if (entity) {
        return res.status(statusCode).json(entity);
      }
      return null;
    };
  }

  static _patchUpdates(patches) {
    return entity => {
      try {
        jsonpatch.apply(entity, patches, /*validate*/ true);
      } catch (err) {
        return Promise.reject(err);
      }

      return entity.save();
    };
  }

  static _removeEntity(res) {
    return function (entity) {
      if (entity) {
        return entity.remove()
          .then(() => {
            res.sendStatus(204);
          });
      }
    };
  }

  static _handleEntityNotFound(res) {
    return function (entity) {
      if (!entity) {
        res.sendStatus(404);
        return null;
      }
      return entity;
    };
  }

  static _handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return err => res.status(statusCode).send(err);
  }

  // Gets a list of comments
  index(req, res) {
    let size = Number(req.query.size) || 30;
    let page = Number(req.query.page) || 0;
    if (page > 0) {
      page--;
    }
    return Comment.find({}, '-_id -updated_at')
      .sort('id')
      .limit(size)
      .skip(page * size)
      .exec()
      .then(entity => {
        const root = { id: 0, parent_id: null, children: [] };
        let nodeList = { 0: root };
        for (let ent of entity) {
          nodeList[ent.id] = ent;
          nodeList[ent.parent_id].children.push(nodeList[ent.id]);
        }
        return root.children;
      })
      .then(CommentController._respondWithResult(res))
      .catch(CommentController._handleError(res));
  }
  // Gets a list of post_id with comments deep
  getDepth(req, res) {
    let size = Number(req.query.size) || 30;
    let page = Number(req.query.page) || 0;
    if (page > 0) {
      page--;
    }
    return Comment.find({}, '-_id -updated_at -creator_id -text')
      .sort('id')
      .limit(size)
      .skip(page * size)
      .exec()
      .then(entity => {
        const root = { id: 0, parent_id: null, children: [] };
        let nodeList = { 0: root };
        for (let ent of entity) {
          nodeList[ent.id] = ent;
          nodeList[ent.parent_id].children.push(nodeList[ent.id]);
        }
        return root.children;
      })
      .then(entity => {
        const getDepth = ({ children }) => {
          if (children.length) {
            return 1 + (children ? Math.max(...children.map(getDepth)) : 0);
          }
          return 1;
        };
        let result = [];
        for (let ent of entity) {
          result.push({ post_id: ent.post_id, deep: getDepth(ent) });
        }
        return _.sortBy(result, 'deep').reverse();
      })
      .then(CommentController._respondWithResult(res))
      .catch(CommentController._handleError(res));
  }

  // Gets a single Thing from the DB
  show(req, res) {
    return Comment.findById(req.params.id).exec()
      .then(CommentController._handleEntityNotFound(res))
      .then(CommentController._respondWithResult(res))
      .catch(CommentController._handleError(res));
  }

  // Creates a new Thing in the DB
  create(req, res) {
    return Comment.create(req.body)
      .then(CommentController._respondWithResult(res, 201))
      .catch(CommentController._handleError(res));
  }

  // Upserts the given Thing in the DB at the specified ID
  upsert(req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    return Comment.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec()
      .then(CommentController._respondWithResult(res))
      .catch(CommentController._handleError(res));
  }

  // Updates an existing Thing in the DB
  patch(req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    return Comment.findById(req.params.id).exec()
      .then(CommentController._handleEntityNotFound(res))
      .then(CommentController._patchUpdates(req.body))
      .then(CommentController._respondWithResult(res))
      .catch(CommentController._handleError(res));
  }

  // Deletes a Thing from the DB
  destroy(req, res) {
    return Comment.findById(req.params.id).exec()
      .then(CommentController._handleEntityNotFound(res))
      .then(CommentController._removeEntity(res))
      .catch(CommentController._handleError(res));
  }
}
const controller = new CommentController();
module.exports = controller;
