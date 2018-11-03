'use strict';

import superagent from 'superagent';
// import faker from 'faker';

import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock } from './lib/profile-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

describe('/profile', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeProfileMock);

  test('POST /profile should return 200 and new profile', () => {
    let accountMock = null;
    return createAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${API_URL}/profile`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            firstName: 'kris',
            age: 28,
            homeState: 'WA',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.profile.accountId).toEqual(accountMock.account.id);
        expect(response.body.profile.firstName).toEqual('kris');
        expect(response.body.profile.homeState).toEqual('WA');
        expect(response.body.profile.age).toEqual(28);
      });
  });
});
