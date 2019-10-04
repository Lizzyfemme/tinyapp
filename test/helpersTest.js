const { assert } = require('chai');
const bcrypt = require('bcrypt');
const checkUserEmail = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "jkl@gmail.com",
    password: bcrypt.hashSync("jkl", 10)
  },
  "aJ48lW": {
    id: "aJ48lW",
    email: "asd@gmail.com",
    password: bcrypt.hashSync("asd", 10),
  }
};

describe('getUserByEmail', function () {
  it('should return a user with valid email', function () {
    const user = checkUserEmail("jkl@gmail.com", testUsers)
    const expectedOutput = testUsers.userRandomID;
    assert.equal(user, expectedOutput)
  });
  it('Invalid email will fail', function () {
    const user = checkUserEmail("jkl@hotmail.com", testUsers)
    const expectedOutput = testUsers.userRandomID;
    assert.notEqual(user, expectedOutput)
  });
  it('Invalid email will be undefined', function () {
    const user = checkUserEmail("jkl@hotmail.com", testUsers)
    const expectedOutput = undefined;
    assert.equal(user, expectedOutput)
  });
});