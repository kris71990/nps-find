'use strict';

import superagent from 'superagent';

import { startServer, stopServer } from '../lib/server';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';
import mockParks from './lib/park-mock';
import { removeMocks } from './lib/state-mock';
import createReports from './lib/report-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Report Router test coverage

POST /report - 200 - returns successfully submitted report
POST /report - 400 - fails with missing profileId, parkId, or other required data
POST /report - 401 - fails with missing auth token

GET /report/:profileId - 200 - returns all reports for specific profile
GET /report/:prodileId - 401 - fails with missing auth token

GET /report/:parkId - 200 - returns all reports for specific park, if any exist

*/

describe('Report Router', () => {
  beforeAll(startServer);
  afterEach(removeMocks);
  afterEach(removeProfileMock);
  afterAll(stopServer);

  describe('POST /report', () => {
    test('POST /report should post and return a park report', () => {
      return mockParks('AZ', 3, 'W')
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
                .send({
                  parkId: parks[0].pKeyCode,
                  profileId: profileMock.profile.id,
                  parkName: parks[0].fullName,
                  rating: 5,
                  lengthOfStay: 72,
                  activities: 'hiking, fishing, photography',
                  parkEnvironment: 'rural',
                  parkLandscape: 'mountains',
                  weather: 'sunny',
                })
                .then((response) => {
                  expect(response.status).toEqual(200);
                  expect(response.body.profileId).toEqual(profileMock.profile.id);
                  expect(response.body.parkId).toEqual(parks[0].pKeyCode);
                  expect(response.body.rating).toEqual(5);
                  expect(response.body.lengthOfStay).toEqual(72);
                  expect(response.body.activities).toEqual('hiking, fishing, photography');
                  expect(response.body.parkEnvironment).toEqual('rural');
                  expect(response.body.parkLandscape).toEqual('mountains');
                  expect(response.body.weather).toEqual('sunny');
                });
            });
        });
    });

    test('POST /report with missing parkId and name will return bad request', () => {
      return createProfileMock()
        .then((profileMock) => {
          return superagent.post(`${API_URL}/report`)
            .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
            .send({
              profileId: profileMock.profile.id,
              rating: 5,
              lengthOfStay: 72,
              activities: 'hiking, fishing, photography',
            })
            .catch((response) => {
              expect(response.status).toEqual(400);
            });
        });      
    });

    test('POST /report with missing profileId will return bad request', () => {
      return mockParks('AZ', 3, 'W')
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
                .send({
                  parkId: parks[0].pKeyCode,
                  fullName: parks[0].fullName,
                  rating: 5,
                  lengthOfStay: 72,
                  activities: 'hiking, fishing, photography',
                })
                .catch((response) => {
                  expect(response.status).toEqual(400);
                });
            });
        });        
    });

    test('POST /report with missing required data returns bad request', () => {
      return mockParks('AZ', 3, 'W')
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
                .send({
                  parkId: parks[0].pKeyCode,
                  parkName: parks[0].fullName,
                  profileId: profileMock.profile.id,
                  rating: 5,
                  activities: 'hiking, fishing, photography',
                })
                .catch((response) => {
                  expect(response.status).toEqual(400);
                });
            });
        });
    });

    test('POST /report with missing token returns unauthorized', () => {
      return mockParks('AK', 2, 'NW')
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .send({
                  parkId: parks[0].pKeyCode,
                  profileId: profileMock.profile.id,
                  parkName: parks[0].fullName,
                  rating: 5,
                  lengthOfStay: 72,
                  activities: 'hiking, fishing, photography',
                })
                .catch((response) => {
                  expect(response.status).toEqual(401);
                });
            });
        });
    });
  });
  
  describe('GET /report/profile/:profileId', () => {
    test('GET /report/profile/:profileId should return all reports posted by profile', () => {
      return createReports(4)
        .then((reportMock) => {
          return superagent.get(`${API_URL}/report/profile/${reportMock.profile.profile.id}`)
            .set('Authorization', `Bearer ${reportMock.profile.accountSetMock.token}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toBeInstanceOf(Array);
              expect(response.body).toHaveLength(4);
              expect(response.body[0].profileId).toEqual(reportMock.profile.profile.id);
              expect(response.body[1].profileId).toEqual(reportMock.profile.profile.id);
              expect(response.body[2].profileId).toEqual(reportMock.profile.profile.id);
              expect(response.body[3].profileId).toEqual(reportMock.profile.profile.id);
            });
        });
    });

    test('GET /report/profile/:profileId with no auth token should return 401', () => {
      return createReports(3)
        .then((reportMock) => {
          return superagent.get(`${API_URL}/report/profile/${reportMock.profile.profile.id}`)
            .catch((response) => {
              expect(response.status).toEqual(401);
            });
        });
    });
  });

  describe('GET /report/park/:parkId', () => {
    test('GET /report/park/:parkId should return all reports for one park', () => {
      return createReports(3)
        .then((reportMock) => {
          return superagent.get(`${API_URL}/report/park/${reportMock.parks[0].pKeyCode}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toHaveLength(3);
              expect(response.body[0].parkId).toEqual(reportMock.parks[0].pKeyCode);
              expect(response.body[1].parkId).toEqual(reportMock.parks[0].pKeyCode);
              expect(response.body[2].parkId).toEqual(reportMock.parks[0].pKeyCode);
            });
        });
    }); 

    test('GET /report/park/:parkId should return empty array if no reports exist', () => {
      return createReports(2)
        .then((reportMock) => {
          return superagent.get(`${API_URL}/report/park/${reportMock.parks[1].pKeyCode}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body).toHaveLength(0);
            });
        });
    });
  });

  describe('DELETE /report/:id', () => {
    test('DELETE /report/:id with id removes profile', () => {
      return createReports(3)
        .then((reportMock) => {
          return superagent.delete(`${API_URL}/report/${reportMock.reports[0].id}`)
            .set('Authorization', `Bearer ${reportMock.profile.accountSetMock.token}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
        });
    });

    test('DELETE /report/:id with wrong id returns 404', () => {
      return createReports(3)
        .then((reportMock) => {
          return superagent.delete(`${API_URL}/report/1234`)
            .set('Authorization', `Bearer ${reportMock.profile.accountSetMock.token}`);
        })
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });

    test('DELETE /report/:id without token returns 401', () => {
      return createReports(2)
        .then((reportMock) => {
          return superagent.delete(`${API_URL}/report/${reportMock.reports[0].id}`);
        })
        .catch((response) => {
          expect(response.status).toEqual(401);
        });
    });
  });
});
