'use strict';

import superagent from 'superagent';

import { startServer, stopServer } from '../lib/server';
import { removeProfileMock, createProfileMock } from './lib/profile-mock';
import mockParks from './lib/park-mock';
import { removeMocks } from './lib/state-mock';

const API_URL = `http://localhost:${process.env.PORT}`;

/* Report Router test coverage

POST /report - 200 - returns successfully submitted report
POST /report - 400 - fails with missing profileId, parkId, or other required data

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
          return superagent.post(`${API_URL}/report`)
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

    test('POST /report with missing required data returns bad request', () => {
      return mockParks('AZ', 3)
        .then((parks) => {
          return createProfileMock()
            .then((profileMock) => {
              return superagent.post(`${API_URL}/report`)
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
  });
});
