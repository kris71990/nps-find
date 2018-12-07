'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMocks } from './lib/state-mock';
import mockParks from './lib/park-mock';
import mockCampgrounds from './lib/campground-mock';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Park Router test coverage

GET /parks/:stateId - 200 - success, returns park types associated with interests, returns null if no interests
GET /parks/:stateId - 400 - fails if stateId is anything but an existing state

PUT /parks/:stateId - 200 - returns all updated parks depending on user query object

*/

describe('Park Router', () => {
  beforeAll(startServer);
  afterEach(removeMocks);
  afterEach(removeProfileMock);
  afterAll(stopServer);

  describe('GET /parks/:stateId', () => {
    test('GET from /parks/:stateId should return preferences object and enter state and park data in to db', () => {
      return mockParks('NH', 5, 'NE')
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
      return mockParks('NH', 2, 'NE')
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

  describe('GET /parks/:', () => {
    test('GET /parks/region/:regionId should return all parks in region', () => {
      return mockParks('NH', 3, 'NE')
        .then(() => {
          return mockParks('ME', 2, 'NE')
            .then(() => {
              return mockParks('TX', 1, 'S')
                .then(() => {
                  return createProfileMock()
                    .then((profile) => {
                      return superagent.get(`${API_URL}/parks/region/NE`)
                        .set('Authorization', `Bearer ${profile.accountSetMock.token}`)
                        .then((response) => {
                          expect(response.status).toEqual(200);
                          expect(response.body).toHaveLength(5);
                          response.body.forEach((park) => {
                            expect(park.stateCode).not.toEqual('TX');
                          });
                        });
                    });
                });
            });
        });
    });

    test('GET /parks/userprefs/all should return all parks matching weather preferences', () => {
      const weatherPrefs = 'snow,rain';
      const rx = /(snow)|(rain)/;
      return mockParks('WA', 10, 'NW')
        .then(() => {
          return createProfileMock()
            .then((profile) => {
              return superagent.get(`${API_URL}/parks/userprefs/all`)
                .set('Authorization', `Bearer ${profile.accountSetMock.token}`)
                .query({ climate: weatherPrefs })
                .then((response) => {
                  expect(response.status).toEqual(200);
                  expect(response.body).toHaveLength(7);
                  response.body.forEach((park) => {
                    expect(park.weatherInfo).toMatch(rx);
                  });
                });
            });
        });
    });

    test('GET /parks/userprefs/all without prefs returns 400', () => {
      return mockParks('WA', 3, 'NW')
        .then(() => {
          return createProfileMock()
            .then((profile) => {
              return superagent.get(`${API_URL}/parks/userprefs/all`)
                .set('Authorization', `Bearer ${profile.accountSetMock.token}`)
                .catch((response) => {
                  expect(response.status).toEqual(400);
                });
            });
        });
    });
  });

  describe('PUT /parks/:stateId', () => {
    test('PUT should update and return parks for one state (with camping and interests)', () => {
      const userQueryObj = {
        parkTypes: [
          'National Park',
          'National Monument',
        ],
        camping: true,
      };
      return mockCampgrounds('AK', 3)
        .then(() => {
          return superagent.put(`${API_URL}/parks/AK`)
            .send(userQueryObj)
            .then((response) => {
              expect(response.status).toEqual(200);
              response.body.forEach((park) => {
                expect(park.camping).toEqual(true);
                expect(userQueryObj.parkTypes.includes(park.designation)).toEqual(true);
              });
            });
        });
    });

    test('PUT should update and return parks for state (with interests, without camping)', () => {
      const userQueryObj = {
        parkTypes: [
          'National Park',
          'National Monument',
        ],
        camping: false,
      };
      return mockCampgrounds('ME', 3)
        .then(() => {
          return superagent.put(`${API_URL}/parks/ME`)
            .send(userQueryObj)
            .then((response) => {
              expect(response.status).toEqual(200);
              response.body.forEach((park) => {
                expect(userQueryObj.parkTypes.includes(park.designation)).toEqual(true);
              });
            });
        });
    });

    test('PUT should update and return parks for state (no interests but camping)', () => {
      const userQueryObj = {
        parkTypes: [],
        camping: true,
      };
      return mockCampgrounds('ME', 2)
        .then(() => {
          return superagent.put(`${API_URL}/parks/ME`)
            .send(userQueryObj)
            .then((response) => {
              expect(response.status).toEqual(200);
              response.body.forEach((park) => {
                expect(park.camping).toEqual(true);
              });
              expect(userQueryObj.parkTypes).toHaveLength(0);
            });
        });
    });

    test('PUT should update and return parks for state (no interests or camping)', () => {
      return mockCampgrounds('ME', 3)
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
