/**
 * Thing model events
 */

'use strict';
const EventEmitter = require('events').EventEmitter;
const Comment = require('./comment.model');
var CommentEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
CommentEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  let event = events[e];
  Comment.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    CommentEvents.emit(`${event}:${doc._id}`, doc);
    CommentEvents.emit(event, doc);
  };
}

module.exports = CommentEvents;
