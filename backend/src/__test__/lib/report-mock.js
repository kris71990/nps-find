'use strict';

import faker from 'faker';
import models from '../../models/index';

import { createProfileMock } from './profile-mock';
import mockParks from './park-mock';

const createReports = (total) => {
  const mockResponse = {};
  return mockParks('UT', 2)
    .then((parks) => {
      mockResponse.parks = parks;
      return createProfileMock()
        .then((profileMock) => {
          mockResponse.profile = profileMock;
          const arr = [];
          for (let i = 0; i < total; i++) {
            arr.push({
              parkId: parks[0].pKeyCode,
              profileId: profileMock.profile.id,
              parkName: parks[0].fullName,
              activities: faker.lorem.words(),
              lengthOfStay: faker.random.number(),
              rating: faker.random.number(),
            });
          }
          return models.report.bulkCreate(arr)
            .then((reports) => {
              mockResponse.reports = reports;
              return mockResponse;
            });
        });
    });
};

export default createReports;
