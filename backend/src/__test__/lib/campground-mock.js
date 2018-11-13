'use strict';

import faker from 'faker';
import models from '../../models/index';
import mockParks from './park-mock';

const mockCampgrounds = (stateCode, total) => {
  return mockParks(stateCode, 3)
    .then((mockParksCreated) => {
      const campgrounds = [];
      for (let i = 0; i < total; i++) {
        campgrounds.push({
          parkId: mockParksCreated[0].pKeyCode,
          state: mockParksCreated[0].stateCode,
          name: faker.lorem.words(),
          description: faker.lorem.words(),
        });
      }
      return models.campground.bulkCreate(campgrounds)
        .then((campgroundsCreated) => {
          return campgroundsCreated;
        });
    });
};

export default mockCampgrounds;
