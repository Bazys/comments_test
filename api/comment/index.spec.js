const proxyquire = require('proxyquire').noPreserveCache();
require('../../mocha.conf.js');

let commentCtrlStub = {
  index: 'commentCtrl.index',
  show: 'commentCtrl.show',
  create: 'commentCtrl.create',
  upsert: 'commentCtrl.upsert',
  patch: 'commentCtrl.patch',
  destroy: 'commentCtrl.destroy'
};

let routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
let commentIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './comment.controller': commentCtrlStub
});

describe('Comment API Router:', () => {
  it('should return an express router instance', () => {
    expect(commentIndex).to.equal(routerStub);
  });

  describe('GET /api/comments', () => {
    it('should route to comment.controller.index', () => {
      expect(routerStub.get
        .withArgs('/', 'commentCtrl.index')
      ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/comments/:id', () => {
    it('should route to comment.controller.show', () => {
      expect(routerStub.get
        .withArgs('/:id', 'commentCtrl.show')
      ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/comments', () => {
    it('should route to comment.controller.create', () => {
      expect(routerStub.post
        .withArgs('/', 'commentCtrl.create')
      ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/comments/:id', () => {
    it('should route to comment.controller.upsert', () => {
      expect(routerStub.put
        .withArgs('/:id', 'commentCtrl.upsert')
      ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/comments/:id', () => {
    it('should route to comment.controller.patch', () => {
      expect(routerStub.patch
        .withArgs('/:id', 'commentCtrl.patch')
      ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/comments/:id', () => {
    it('should route to comment.controller.destroy', () => {
      expect(routerStub.delete
        .withArgs('/:id', 'commentCtrl.destroy')
      ).to.have.been.calledOnce;
    });
  });
});
