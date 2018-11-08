'use strict';

import superagent from 'superagent';

import { startServer, stopServer } from '../lib/server';
import { createAccountMock } from './lib/account-mock';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Profile Router test coverage (AUTH REQUIRED)

POST /profile - 200 - success
POST /profile - 400 - fails if missing required data
POST /profile - 401 - fails if missing account authentication token
POST /profile - 409 - fails if user profile already exists

PUT /profile/:id - 200 - success
PUT /profile/:id - 401 - fails if missing account authentication token
PUT /profile/:id - 400 - fails if profile id is incorrect, missing, or if required data is deleted

GET /profile/me - 200 - success
GET /profile/me - 401 - fails if missing account authenticatio token

*/

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
          expect(response.body.accountId).toEqual(accountMock.account.id);
          expect(response.body.firstName).toEqual('kris');
          expect(response.body.homeState).toEqual('WA');
          expect(response.body.age).toEqual(28);
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
      return superagent.post(`${API_URL}/profile`)
        .send({
          firstName: 'kris',
          age: 28,
          homeState: 'WA',
        })
        .catch((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toBeFalsy();
        });
    });

    test('POST /profile with incorrect token returns 401', () => {
      return superagent.post(`${API_URL}/profile`)
        .set('Authorization', 'Bearer 1234567')
        .send({
          firstName: 'Kris',
          age: 28,
          homeState: 'WA',
        })
        .catch((response) => {
          expect(response.status).toEqual(401);
          expect(response.body).toBeFalsy();
        });
    });

    test('POST /profile when profile exists returns 409', () => {
      return createProfileMock()
        .then((profileMock) => {
          return superagent.post(`${API_URL}/profile`)
            .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
            .send({
              firstName: 'kris',
              age: 28,
              homeState: 'WA',
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(409);
        });
    }); 
  });

  describe('GET /profile/me', () => {
    test('GET /profile/me should return my profile', () => {
      let profileMockSet = null;
      return createProfileMock()
        .then((profileMock) => {
          profileMockSet = profileMock;
          return superagent.get(`${API_URL}/profile/me`)
            .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.id).toEqual(profileMockSet.profile.id);
          expect(response.body.firstName).toEqual(profileMockSet.profile.firstName);
          expect(response.body.age).toEqual(profileMockSet.profile.age);
          expect(response.body.homeState).toEqual(profileMockSet.profile.homeState);
        });
    });

    test('GET /profile/me without credentials returns 401', () => {
      return createProfileMock()
        .then(() => {
          return superagent.get(`${API_URL}/profile/me`);
        })
        .catch((response) => {
          expect(response.status).toEqual(401);
        });
    });
  });

  describe('PUT /profile/:id', () => {
    test('PUT /profile/:id with new data returns updated profile', () => {
      let profileMockSet = null;
      return createProfileMock()
        .then((profileMock) => {
          profileMockSet = profileMock;
          return superagent.put(`${API_URL}/profile/${profileMock.profile.accountId}`)
            .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
            .send({
              age: 30,
              homeState: 'CA',
            });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body[0]).toBeInstanceOf(Object);
          expect(response.body[0].id).toEqual(profileMockSet.profile.id);
          expect(response.body[0].age).toEqual(30);
          expect(response.body[0].homeState).toEqual('CA');
          expect(response.body[0].firstName).toEqual(profileMockSet.profile.firstName);
        });
    });

    test('PUT /profile/:id without token returns 401', () => {
      return createProfileMock()
        .then((profileMock) => {
          return superagent.put(`${API_URL}/profile/${profileMock.profile.id}`)
            .send({
              age: 30,
              homeState: 'CA',
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(401);
        });
    }); 

    test('PUT /profile/:id with wrong id returns 404', () => {
      return createProfileMock()
        .then((profileMock) => {
          return superagent.put(`${API_URL}/profile/28374`)
            .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
            .send({
              age: 30,
              homeState: 'CA',
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });

    test('PUT /profile/:id without id returns 404', () => {
      return createProfileMock()
        .then((profileMock) => {
          return superagent.put(`${API_URL}/profile`)
            .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
            .send({
              age: 30,
              homeState: 'CA',
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    test('PUT /profile/:id removing required fields returns 400', () => {
      return createProfileMock()
        .then((profileMock) => {
          return superagent.put(`${API_URL}/profile/${profileMock.profile.id}`)
            .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
            .send({
              firtName: null,
              age: undefined,
              homeState: '',
            });
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
});
