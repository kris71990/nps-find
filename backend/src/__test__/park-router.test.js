'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Test state-router - /state', () => {
  beforeAll(startServer);
  afterAll(stopServer);

  test('GET from /parks/:stateId should return parks in that state from api', () => {
    return superagent.get(`${API_URL}/parks/SC`)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toBeInstanceOf(Object);
        expect(response.body[0].parkCode).not.toBe(null);
        expect(response.body[0].stateCode).not.toBe(null);
        expect(response.body[0].pKeyCode).not.toBe(null);
      });
  });

  test('GET from /parks/:stateId should return parks in that state from db', () => {
    return superagent.get(`${API_URL}/parks/CA`)
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
