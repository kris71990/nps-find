'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMocks } from './lib/state-mock';
import mockParks from './lib/park-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Park Router test coverage

GET /parks/:stateId - 200 - success, returns park types associated with interests, returns null if no interests
GET /parks/:stateId - 400 - fails if stateId is anything but an existing state

*/

describe('Test state-router - /state', () => {
  beforeAll(startServer);
  afterEach(removeMocks);
  afterAll(stopServer);

  test('GET from /parks/:stateId should return preferences object and enter state and park data in to db', () => {
    return mockParks('NH', 5)
      .then(() => {
        return superagent.get(`${API_URL}/parks/NH`)
          .query({ interests: ['hiking', 'camping'] })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toBeInstanceOf(Object);
            expect(response.body.parkTypes).toBeInstanceOf(Array);
            expect(response.body.parkTypes[0]).toBeTruthy();
            expect(response.body.camping).toEqual(true);
          });
      });
  });

  test('GET from /parks/:stateId should return null if no preferences', () => {
    return mockParks('NH', 2)
      .then(() => {
        return superagent.get(`${API_URL}/parks/NH`)
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body).toBeNull();
          });
      });
  });

  test('GET from /parks/:stateId should return parks in that state from api', () => {
    return superagent.get(`${API_URL}/parks/MA`)
      .query({ interests: ['hiking', 'camping'] })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Object);
        expect(response.body.parkTypes).toBeInstanceOf(Array);
        expect(response.body.parkTypes[0]).toBeTruthy();
        expect(response.body.camping).toEqual(true);
      });
  });

  test('GET from /parks/:stateId should return bad request for non-existant state', () => {
    return superagent.get(`${API_URL}/parks/KM`)
      .catch((error) => {
        expect(error.status).toEqual(400);
      });
  });
});
