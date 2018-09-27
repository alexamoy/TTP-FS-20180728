'use strict';
const { expect } = require('chai');
const db = require('../db');
const User = require('./user');

describe('User Model', () => {
  beforeEach(async () => {
    return db.sync({ force: true });
  });
  describe('Validate password', () => {
    let testUser;
    beforeEach(async () => {
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        password: '123'
      });
    });
    it('returns true for correct password', () => {
      expect(testUser.realPassword('123')).to.be.equal(true);
    });
    it('returns false for an incorrect password', () => {
      expect(testUser.realPassword('helloworld')).to.be.equal(false);
    });
  });
  describe('User balance', () => {
    let testUser;
    beforeEach(async () => {
      testUser = await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@user.com',
        password: '123'
      });
    });
    it('sets the default balance to be 5000', () => {
      expect(testUser.balance).to.be.equal('5000.00');
    });
  });
});

