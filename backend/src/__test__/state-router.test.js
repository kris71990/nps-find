'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Testing state router - /states', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  
  // for park list view
  describe('GET /states', () => {
    test('GET /states should return object of states in descending order of total parks, with types object', () => {
      return superagent.get(`${API_URL}/states`)
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body).toBeInstanceOf(Array);
          
          const total0 = response.body[0].total;
          const total1 = response.body[1].total;
          expect(total0).toBeGreaterThan(total1);
          expect(response.body[0].types).toBeTruthy();
          expect(response.body[0].types).toBeInstanceOf(Object);
        });
    });
    
    test('GET /states/types should return array of all park types', () => {
      return superagent.get(`${API_URL}/states/types`)
        .then((response) => {
          console.log(response.body);
          expect(response.status).toEqual(200);
          expect(response.body).toBeInstanceOf(Array);
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
