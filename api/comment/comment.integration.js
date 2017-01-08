'use strict';

const app = require('../..');
const request = require('supertest');
require('../../mocha.conf.js');

let newComment = {};

describe('Comments API:', () => {
  describe('GET /api/comments', () => {
    let comments;

    beforeEach(done => {
      request(app)
        .get('/api/comments')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          comments = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      expect(comments).to.be.instanceOf(Array);
    });
  });

  describe('GET api/comments/depth', () => {
    let commentsDepth;

    beforeEach(done => {
      request(app)
        .get('/api/comments/depth')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          commentsDepth = res.body;
          done();
        });
    });

    it('should respond with JSON array', () => {
      expect(commentsDepth).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/comments', () => {
    beforeEach(done => {
      request(app)
        .post('/api/comments')
        .send({
          id: 0,
          parent_id: 0,
          post_id: 0,
          text: 'This is the brand new comment!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newComment = res.body;
          done();
        });
    });

    it('should respond with the newly created comment', () => {
      expect(newComment.id).to.equal(0);
      expect(newComment.text).to.equal('This is the brand new comment!!!');
    });
  });

  describe('GET /api/comments/:id', () => {
    var comment;

    beforeEach(done => {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          comment = res.body;
          done();
        });
    });

    afterEach(function () {
      comment = {};
    });

    it('should respond with the requested comment', () => {
      expect(newComment.id).to.equal(0);
      expect(newComment.text).to.equal('This is the brand new comment!!!');
    });
  });

  describe('PUT /api/comments/:id', () => {
    var updatedThing;

    beforeEach(done => {
      request(app)
        .put(`/api/comments/${newComment._id}`)
        .send({
          id: 1000,
          text: 'This is the updated comment!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          updatedThing = res.body;
          done();
        });
    });

    afterEach(() => {
      updatedThing = {};
    });

    it('should respond with the updated comment', () => {
      expect(updatedThing.id).to.equal(1000);
      expect(updatedThing.text).to.equal('This is the updated comment!!!');
    });

    it('should respond with the updated comment on a subsequent GET', (done) => {
      request(app)
        .get(`/api/comments/${newComment._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          let comment = res.body;

          expect(comment.id).to.equal(1000);
          expect(comment.text).to.equal('This is the updated comment!!!');

          done();
        });
    });
  });

  describe('PATCH /api/comments/:id', () => {
    var patchedThing;

    beforeEach(done => {
      request(app)
        .patch(`/api/comments/${newComment._id}`)
        .send([
          { op: 'replace', path: '/id', value: 9999 },
          { op: 'replace', path: '/text', value: 'This is the patched comment!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          patchedThing = res.body;
          done();
        });
    });

    afterEach(() => {
      patchedThing = {};
    });

    it('should respond with the patched comment', () => {
      expect(patchedThing.id).to.equal(9999);
      expect(patchedThing.text).to.equal('This is the patched comment!!!');
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should respond with 204 on successful removal', done => {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
        .expect(204)
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when comment does not exist', done => {
      request(app)
        .delete(`/api/comments/${newComment._id}`)
        .expect(404)
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});
