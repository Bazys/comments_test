const User = require('./user.model');
require('../../mocha.conf.js');

let user;
let genUser = () => {
  user = new User({
    provider: 'local',
    name: 'Fake User',
    email: 'test@example.com',
    password: 'password'
  });
  return user.save();
};

describe('User Model', () => {
  // Clear users before testing
  before(() => User.remove({}));

  beforeEach(() => genUser());

  afterEach(() => User.remove({}));

  it('should begin with no users', () => expect(User.find({}).exec()).to.eventually.have.length(0));

  it('should fail when saving a duplicate user', done => {
    expect(user.save()
      .then(() => {
        var userDup = genUser();
        return userDup.save();
      })).to.be.rejected;
    done();
  });

  describe('#email', () => {
    it('should fail when saving with a blank email', () => {
      user.email = '';
      return expect(user.save()).to.be.rejected;
    });

    it('should fail when saving with a null email', () => {
      user.email = null;
      return expect(user.save()).to.be.rejected;
    });

    it('should fail when saving without an email', () => {
      user.email = undefined;
      return expect(user.save()).to.be.rejected;
    });
  });

  describe('#password', () => {
    it('should fail when saving with a blank password', done => {
      user.password = '';
      expect(user.save()).to.be.rejected;
      done();
    });

    it('should fail when saving with a null password', done => {
      user.password = null;
      expect(user.save()).to.be.rejected;
      done();
    });

    it('should fail when saving without a password', done => {
      user.password = undefined;
      expect(user.save()).to.be.rejected;
      done();
    });

    describe('given the user has been previously saved', () => {
      beforeEach(done => {
        user.save();
        done();
      });

      it('should authenticate user if valid', () => {
        expect(user.authenticate('password')).to.be.true;
      });

      it('should not authenticate user if invalid', () => {
        expect(user.authenticate('blah')).to.not.be.true;
      });

      it('should remain the same hash unless the password is updated', done => {
        user.name = 'Test User';
        expect(user.save()
          .then((u) => {
            return u.authenticate('password');
          })).to.eventually.be.true;
        done();
      });
    });
  });
});
