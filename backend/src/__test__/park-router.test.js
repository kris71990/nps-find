'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';
import { removeMocks } from './lib/state-mock';
import mockParks from './lib/park-mock';
import mockCampgrounds from './lib/campground-mock';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';
import createReports from './lib/report-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Park Router test coverage

GET /parks/:stateId - 200 - success, returns park types associated with interests, returns null if no interests
GET /parks/:stateId - 400 - fails if stateId is anything but an existing state
GET /park/:parkId - 200 - returns single park

GET /parks/region - 200 - returns all parks within a geographic region
GET /parks/userprefs/all - 200 - return parks by user preference (weather, landscape, environment)
GET /parks/userprefs/all - 401 - fails if unuauthorized
GET /parks/userprefs/all - 401 - fails if no user prefs

GET /parks/all/top - 200 - returns parks in order of total reports
GET /parks/all/random - 200 - returns random selection of parks

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

    test('GET from /park/:parkId should return a single park', () => {
      return mockParks('WV', 2, 'E')
        .then((parks) => {
          return superagent.get(`${API_URL}/park/${parks[0].pKeyCode}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toBeInstanceOf(Object);
              expect(response.body.pKeyCode).toEqual(parks[0].pKeyCode);
            });
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
      return createReports(10)
        .then(() => {
          return createProfileMock()
            .then((profile) => {
              return superagent.get(`${API_URL}/parks/userprefs/all`)
                .set('Authorization', `Bearer ${profile.accountSetMock.token}`)
                .query({ climate: weatherPrefs })
                .then((response) => {
                  expect(response.status).toEqual(200);
                  expect(response.body).toHaveLength(1);
                  response.body.forEach((park) => {
                    expect(park.weather).toMatch(rx);
                    expect(park.reports).toEqual(4);
                  });
                });
            });
        });
    });

    test('GET /parks/userprefs/all should return all parks matching landscape', () => {
      const landscapePrefs = 'mountains,ocean';
      const rx = /(\bmountains)|\b(ocean)/;
      return createReports(10)
        .then(() => {
          return createProfileMock()
            .then((profile) => {
              return superagent.get(`${API_URL}/parks/userprefs/all`)
                .set('Authorization', `Bearer ${profile.accountSetMock.token}`)
                .query({ landscape: landscapePrefs })
                .then((response) => {
                  expect(response.status).toEqual(200);
                  expect(response.body).toHaveLength(1);
                  response.body.forEach((park) => {
                    expect(park.parkLandscape).toMatch(rx);
                    // expect(park.reports).toEqual(7);
                  });
                });
            });
        });
    });

    test('GET /parks/userprefs/all should return all parks matching environment', () => {
      const environmentPrefs = 'suburban';
      const rx = /(\burban)|(\brural)/;
      return createReports(10)
        .then(() => {
          return createProfileMock()
            .then((profile) => {
              return superagent.get(`${API_URL}/parks/userprefs/all`)
                .set('Authorization', `Bearer ${profile.accountSetMock.token}`)
                .query({ environment: environmentPrefs })
                .then((response) => {
                  expect(response.status).toEqual(200);
                  expect(response.body).toHaveLength(1);
                  response.body.forEach((park) => {
                    expect(park.parkEnvironment).toMatch(rx);
                    // expect(park.reports).toEqual(7);
                  });
                });
            });
        });
    });

    test('GET /parks/userprefs/all without token returns 401', () => {
      return superagent.get(`${API_URL}/parks/userprefs/all`)
        .catch((response) => {
          expect(response.status).toEqual(401);
        });
    });

    test('GET /parks/userprefs/all without prefs returns 400', () => {
      return createProfileMock()
        .then((profile) => {
          return superagent.get(`${API_URL}/parks/userprefs/all`)
            .set('Authorization', `Bearer ${profile.accountSetMock.token}`)
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        });
    });

    test('GET /parks/all/top', () => {
      return createReports(7)
        .then(() => {
          return superagent.get(`${API_URL}/parks/all/top`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body[0].reports).toEqual('7');
            });
        });
    });

    test('GET /parks/all/random', () => {
      return mockParks('CA', 4, 'W')
        .then(() => {
          return superagent.get(`${API_URL}/parks/all/random`)
            .then((response) => {
              expect(response.status).toEqual(200);
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
