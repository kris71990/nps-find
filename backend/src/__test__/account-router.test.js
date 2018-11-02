'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { createAccountMock, removeAccountMock } from './lib/account-mock';


const apiUrl = `http://localhost:${process.env.PORT}`;

describe('User Authentication', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeAccountMock);

  describe('POST to /signup', () => {
    test('POST - 200 - success', () => {
      return superagent.post(`${apiUrl}/signup`)
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
  });

  describe('GET from /login', () => {
    test('GET - 200 success', () => {
      return createAccountMock()
        .then((mock) => {
          return superagent.get(`${apiUrl}/login`)
            .auth(mock.request.username, mock.request.password);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.token).toBeTruthy();
        });
    });
  });
});
