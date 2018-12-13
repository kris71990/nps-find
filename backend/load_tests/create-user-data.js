'use strict';

const faker = require('faker');

const loadTestUser = module.exports = {};

loadTestUser.create = (userContext, events, done) => {
  // account data
  userContext.vars.username = faker.internet.userName() + Math.random().toString();
  userContext.vars.email = faker.internet.email();
  userContext.vars.password = faker.internet.password() + Math.random.toString();

  // profile data
  userContext.vars.firstName = faker.name.firstName();
  userContext.vars.age = faker.random.number();
  userContext.vars.homeState = faker.address.state();
  return done();
};
