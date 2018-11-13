'use strict';

import faker from 'faker';
import models from '../../models/index';

// creates state and random number of parks per state
const mockParks = (stateCode, total) => {
  const designationTypes = [
    'National Monument', 
    'National Park', 
    'Other',
    'Other',
  ];
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
          pKeyCode: faker.lorem.word() + Math.random(),
          description: faker.lorem.words(),
          designation: designationTypes[Math.floor(Math.random() * 3)],
        });
      }
      return models.park.bulkCreate(arr)
        .then((parks) => {
          return parks;
        });
    });
};

export default mockParks;
