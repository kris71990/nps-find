'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMocks } from './lib/state-mock';
import mockParks from './lib/park-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Testing state router - /states', () => {
  beforeAll(startServer);
  afterEach(removeMocks);
  afterAll(stopServer);
  
  // for park list view
  describe('/states', () => {
    test('GET /states should return object of states in descending order of total parks, with types object', () => {
      return mockParks('MI', 4)
        .then(() => mockParks('NM', 2))
        .then(() => {
          return superagent.get(`${API_URL}/states`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toBeInstanceOf(Array);
              expect(response.body[0].total).toEqual(4);
              expect(response.body[0].stateId).toEqual('MI');
              expect(response.body[1].total).toEqual(2);
              expect(response.body[1].stateId).toEqual('NM');
              expect(response.body[0].types).toBeTruthy();
              expect(response.body[0].types).toBeInstanceOf(Object);
            });
        });
    });
  
    test('GET /states should return empty array if no data exists', () => {
      return superagent.get(`${API_URL}/states`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body).toHaveLength(0);
        });
    });
  });

  // for array of all park types
  describe('/states/types', () => {
    test('GET /states/types should return array of all park types', () => {
      return mockParks('MI', 4)
        .then(() => mockParks('UT', 2))
        .then(() => {
          return superagent.get(`${API_URL}/states/types`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toBeInstanceOf(Array);
              expect(response.body[0]).toBeTruthy();
            });
        });
    });
  
    test('GET /states/types should return empty array if no data exists', () => {
      return superagent.get(`${API_URL}/states/types`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body).toHaveLength(0);
        });
    });
  });

  test('404-catch-all', () => {
    return superagent.get(`${API_URL}/catchall`)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
