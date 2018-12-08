'use strict';

import faker from 'faker';
import models from '../../models/index';

import { createProfileMock } from './profile-mock';
import mockParks from './park-mock';

const createReports = (total) => {
  const mockResponse = {};
  return mockParks('UT', 2, 'W')
    .then((parks) => {
      mockResponse.parks = parks;
      return createProfileMock()
        .then((profileMock) => {
          mockResponse.profile = profileMock;
          const arr = [];

          const weather = ['hot', 'warm', 'cold', 'snow', 'rain'];
          const environment = ['urban', 'suburban', 'rural'];
          const landscape = ['mountains', 'forest', 'plains', 'ocean'];

          for (let i = 0; i < total; i++) {
            arr.push({
              id: faker.random.number(),
              parkId: parks[0].pKeyCode,
              profileId: profileMock.profile.id,
              parkName: parks[0].fullName,
              activities: faker.lorem.words(),
              lengthOfStay: faker.random.number(),
              rating: faker.random.number(),
              parkEnvironment: environment[i % 3],
              parkLandscape: landscape[i % 4],
              weather: weather[i % 5],
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
