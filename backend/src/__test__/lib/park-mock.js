'use strict';

import faker from 'faker';
import models from '../../models/index';

// creates state and random number of parks per state
const mockParks = (stateCode, total) => {
  return models.state.create({
    stateId: stateCode,
    total,
  })
    .then(() => {
      const arr = [];
      for (let i = 0; i < total; i++) {
        arr.push({
          stateCode, 
          parkCode: faker.lorem.word(),
          pKeyCode: faker.lorem.word(),
          description: faker.lorem.words(),
        });
      }
      return models.park.bulkCreate(arr);
    });
};

export default mockParks;
