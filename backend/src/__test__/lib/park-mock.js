'use strict';

import faker from 'faker';
import models from '../../models/index';
import { mockState } from './state-mock';

// creates state and random number of parks per state
const mockParks = (stateCode, total, region) => {
  const designationTypes = [
    'National Monument', 
    'National Park', 
    'Other',
    'Other',
  ];
  return mockState(stateCode, total, region)
    .then(() => {
      const arr = [];
      for (let i = 0; i < total; i++) {
        arr.push({
          stateCode, 
          parkCode: faker.lorem.word(),
          pKeyCode: faker.lorem.word() + Math.random(),
          fullName: faker.lorem.words(),
          description: faker.lorem.words(),
          designation: designationTypes[Math.floor(Math.random() * 3)],
          camping: false,
        });
      }
      return models.park.bulkCreate(arr)
        .then((parks) => {
          return parks;
        });
    });
};

export default mockParks;
