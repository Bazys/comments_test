'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CommentSchema = new Schema({
  id: Number,
  post_id: { type: Number, ref: 'Post' },
  parent_id: Number,
  creator_id: { type: Number, ref: 'User' },
  updated_at: { type: Date, default: Date.now(), required: true },
  text: String,
  children: []
}).pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Comment', CommentSchema);
