'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMocks } from './lib/state-mock';
import mockParks from './lib/park-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Park Router test coverage

GET /parks/:stateId - 200 - success, returns park types associated with interests, returns null if no interests
GET /parks/:stateId - 400 - fails if stateId is anything but an existing state

PUT /parks/:stateId - 200 - returns all updated parks depending on user query object

*/

describe('Park Router', () => {
  beforeAll(startServer);
  afterEach(removeMocks);
  afterAll(stopServer);

  describe('GET /parks/:stateId', () => {
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

  describe('PUT /parks/:stateId', () => {
    test('PUT should update and return parks for one state (with camping and interests)', () => {
      return superagent.get(`${API_URL}/parks/TN`)
        .query({ interests: ['hiking', 'camping'] })
        .then((userQueryObj) => {
          return superagent.put(`${API_URL}/parks/TN`)
            .send(userQueryObj.body)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body[0].camping).toBeTruthy();
              expect(userQueryObj.body.parkTypes.includes(response.body[0].designation)).toBeTruthy();
            });
        });
    });

    test('PUT should update and return parks for state (with interests, without camping)', () => {
      return superagent.get(`${API_URL}/parks/ME`)
        .query({ interests: ['hiking'] })
        .then((userQueryObj) => {
          return superagent.put(`${API_URL}/parks/ME`)
            .send(userQueryObj.body)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body[0].camping).toBeFalsy();
              expect(userQueryObj.body.parkTypes.includes(response.body[0].designation)).toBeTruthy();
            });
        });
    });

    test('PUT should update and return parks for state (no interests but camping)', () => {
      return superagent.get(`${API_URL}/parks/ME`)
        .query({ interests: ['camping'] })
        .then((userQueryObj) => {
          return superagent.put(`${API_URL}/parks/ME`)
            .send(userQueryObj.body)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body[0].camping).toBeTruthy();
              expect(userQueryObj.body.parkTypes).toHaveLength(0);
            });
        });
    });

    test('PUT should update and return parks for state (no interests or camping)', () => {
      return superagent.get(`${API_URL}/parks/ME`)
        .then(() => {
          return superagent.put(`${API_URL}/parks/ME`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toBeTruthy();
            });
        });
    });
  });
});
