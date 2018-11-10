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

*/

describe('Report Router', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(removeMocks);
  afterEach(removeProfileMock);

  describe('POST /report', () => {
    test('POST /report should post and return a park report', () => {
      return mockParks('AZ', 3)
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
                .send({
                  parkId: parks[0].pKeyCode,
                  profileId: profileMock.profile.id,
                  rating: 5,
                  lengthOfStay: 72,
                  activities: 'hiking, fishing, photography',
                })
                .then((response) => {
                  expect(response.status).toEqual(200);
                  expect(response.body.profileId).toEqual(profileMock.profile.id);
                  expect(response.body.parkId).toEqual(parks[0].pKeyCode);
                  expect(response.body.rating).toEqual(5);
                  expect(response.body.lengthOfStay).toEqual(72);
                  expect(response.body.activities).toEqual('hiking, fishing, photography');
                });
            });
        });
    });

    test('POST /report with missing parkId will return bad request', () => {
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
      return mockParks('AZ', 3)
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
                .send({
                  parkId: parks[0].pKeyCode,
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
      return mockParks('AZ', 3)
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .set('Authorization', `Bearer ${profileMock.accountSetMock.token}`)
                .send({
                  parkId: parks[0].pKeyCode,
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
      return mockParks('AK', 2)
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
                .send({
                  parkId: parks[0].pKeyCode,
                  profileId: profileMock.profile.id,
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
  
  describe('GET /report/:profileId', () => {
    test('GET /report/:profileId should return all reports posted by profile', () => {
      return createReports(4)
        .then((reportMock) => {
          return superagent.get(`${API_URL}/report/${reportMock.profile.profile.id}`)
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
  });
});
