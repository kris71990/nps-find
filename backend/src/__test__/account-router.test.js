'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/account-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Account Router test coverage - (AUTH REQUIRED)

POST /signup - 200 - success
POST /signup - 400 - fails due to missing required fields
POST /signup - 409 - fails due to duplicate input of unique field

GET /login - 200 - success
GET /login - 400 - fails due to incorrect username or password

*/

describe('User Authentication - Account router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);

  describe('POST to /signup', () => {
    test('POST with credentials returns 200 status and access token', () => {
      return superagent.post(`${API_URL}/signup`)
        .send({
          username: 'Kris',
          email: 'test@test.com',
          password: 'password',
        })
        .then((response) => {          
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test('POST with missing credentials returns 400', () => {
      return superagent.post(`${API_URL}/signup`)
        .send({
          username: 'dfjknsf',
          password: '1234',
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
          expect(response.body).toBeFalsy();
        });
    });

    test('POST with existing credentials returns 409', () => {
      return createAccountMock()
        .then((mockAccount) => {
          return superagent.post(`${API_URL}/signup`)
            .send({
              username: mockAccount.request.username,
              password: '123455',
              email: 'dfsfsdfsdf',
            })
            .catch((response) => {
              expect(response.status).toEqual(409);
              expect(response.body).toBeFalsy();
            });
        });
    }); 
  });

  describe('GET from /login', () => {
    test('GET with credentials should return access token', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.get(`${API_URL}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });

    test('GET with incorrect username returns 400', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.get(`${API_URL}/login`)
            .auth('incorrectusername', mock.request.password);
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
          expect(response.body).toBeFalsy();
        });
    });

    test('GET with incorrect password returns 400', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.get(`${API_URL}/login`)
            .auth(mock.request.username, 'incorrectpassword');
        })
        .catch((response) => {
          expect(response.status).toEqual(400);
          expect(response.body).toBeFalsy();
        });
    });

    test('GET with missing credentials returns 400', () => {
      return superagent.get(`${API_URL}/login`)
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });

    test('GET with malformed credentials returns 400', () => {
      return superagent.get(`${API_URL}/login`)
        .auth('sdfdsfsdfsdfs')
        .catch((response) => {
          expect(response.status).toEqual(400);
        });
    });
  });
});
