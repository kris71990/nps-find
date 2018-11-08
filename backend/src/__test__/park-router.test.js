'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMocks } from './lib/state-mock';
import mockParks from './lib/park-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Park Router test coverage

GET /parks/:stateId - 200 - success, returns all parks in a single state
GET /parks/:stateId - 400 - fails if stateId is anything but an existing state

*/

describe('Test state-router - /state', () => {
  beforeAll(startServer);
  afterEach(removeMocks);
  afterAll(stopServer);

  test('GET from /parks/:stateId should return parks in that state from db', () => {
    return mockParks('NH', 5)
      .then(() => {
        return superagent.get(`${API_URL}/parks/NH`)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body).toHaveLength(5);
            expect(response.body[0]).toBeInstanceOf(Object);
            expect(response.body[0].parkCode).not.toBe(null);
            expect(response.body[0].stateCode).not.toBe(null);
            expect(response.body[0].pKeyCode).not.toBe(null);
          });
      });
  });

  test('GET from /parks/:stateId should return parks in that state from api', () => {
    return superagent.get(`${API_URL}/parks/MA`)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0].parkCode).not.toBe(null);
        expect(response.body[0].stateCode).not.toBe(null);
        expect(response.body[0].pKeyCode).not.toBe(null);
      });
  });

  test('GET from /parks/:stateId should return bad request for non-existant state', () => {
    return superagent.get(`${API_URL}/parks/KM`)
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });
});
