'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMocks } from './lib/state-mock';
import mockCampgrounds from './lib/campground-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Campground Router', () => {
  beforeAll(startServer);
  afterEach(removeMocks);
  afterAll(stopServer);

  describe('GET /campgrounds/:state', () => {
    test('GET from /campgrounds/:state should return all campgrounds from that state', () => {
      return mockCampgrounds('ME', 3)
        .then(() => {
          return superagent.get(`${API_URL}/campgrounds/ME`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toHaveLength(3);
            });
        });
    });

    test('GET from /campgrounds/:state should return empty array if no campgrounds', () => {
      return mockCampgrounds('ME', 3)
        .then(() => {
          return superagent.get(`${API_URL}/campgrounds/TN`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toHaveLength(0);
            });
        });
    });
  });

  describe('GET /campgrounds/park/:parkKey', () => {
    test('GET /campground/park/:parkId should return campgrounds in park', () => {
      return mockCampgrounds('ME', 3)
        .then((mockCampgroundsCreated) => {
          return superagent.get(`${API_URL}/campgrounds/park/${mockCampgroundsCreated[0].parkId}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toHaveLength(3);
            });
        });
    });
  });
});
