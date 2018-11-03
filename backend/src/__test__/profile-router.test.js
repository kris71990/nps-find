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

  describe('POST /profile', () => {
    test('POST /profile with profile data returns 200 and profile', () => {
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

    test('POST /profile with missing data returns 400', () => {
      return createAccountMock()
        .then((accountSetMock) => {
          return superagent.post(`${API_URL}/profile`)
            .set('Authorization', `Bearer ${accountSetMock.token}`)
            .send({
              age: 28,
              homeState: 'WA',
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
          expect(response.body).toBeFalsy();
        });
    });

    test('POST /profile without token returns 401', () => {
      return createAccountMock()
        .then(() => {
          return superagent.post(`${API_URL}/profile`)
            .send({
              firstName: 'kris',
              age: 28,
              homeState: 'WA',
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toBeFalsy();
        });
    });
  });
});
