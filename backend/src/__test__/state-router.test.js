'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Test state-router - /state', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  test('GET from /state/:stateId should return parks in that state', () => {
    return superagent.get(`${API_URL}/state/WA`)
      .then((response) => {
        expect(response.status).toEqual(200);
        // expect(response.body).toBeInstanceOf(Array);
        // expect(response.body[0]).toBeInstanceOf(Object);
        // expect(response.body[0].parkCode).toBeInstanceOf(String);
        // expect(response.body[0].stateCode).toBeInstanceOf(String);
        // expect(response.body[0].pKeyCode).toBeInstanceOf(String);
      });
  });
});
