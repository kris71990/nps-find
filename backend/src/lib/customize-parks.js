'use strict';

import logger from './logger';

const history = [
  'National Military Park', 
  'National Battlefield', 
  'National Battlefield Park', 
  'National Battlefield Site', 
  'National Historic Area',
  'National Heritage Area',
  'National Historic Site',
  'National Historic Park',
  'National Historical Park',
  'National Historical Park and Preserve',
  'National Historical Reserve',
  'National Historic Trail',
  'International Historic Site',
  'National Memorial',
  'Memorial Parkway',
  'Cultural Heritage Corridor',
  'National Monument and Historic Shrine',
  'National Monument',
  'Ecological & Historic Preserve',
  'National Heritage Corridor',
  'Other',
];

const hiking = [
  'National Recreation Area',
  'National Preserve',
  'National Geologic Trail',
  'National Scenic Trail',
  'National Park & Preserve',
  'National and State Parks',
  'International Park',
  'National Park',
  'National Parks',
  'Park',
  'National Historic Trail',
  'National Reserve',
  'National Trail System',
];

const nature = [
  'National Preserve',
  'National Geologic Trail',
  'National Park & Preserve',
  'National Recreation Area',
  'International Park',
  'Park',
  'National Park',
  'National Parks',
  'Wild River',
  'National Parkway',
  'National Monument & Preserve',
  'National and State Parks',
  'National Lakeshore',
  'National Seashore',
  'National Reserve',
  'National River',
  'National Wild & Scenic River & Riverway',
  'National River & Recreation Area',
  'Parkway',
  'National Monument',
  'Affiliated Area',
  'Ecological & Historic Preserve',
  'National Scenic Trail',
];

const customizeParks = (query) => {
  let reqArr;
  if (query.interests && typeof query.interests === 'string') {
    reqArr = [query.interests];
  } else {
    reqArr = query.interests;
  }

  logger.log(logger.INFO, `Filtering for user preferences: ${[...reqArr]}`);
  const interestParkTypes = [];

  if (reqArr) {
    reqArr.forEach((interest) => {
      if (interest === 'history') {
        history.forEach((type) => {
          if (interestParkTypes.indexOf(type) < 0) {
            interestParkTypes.push(type);
          }
        });
      } else if (interest === 'hiking') {
        hiking.forEach((type) => {
          if (interestParkTypes.indexOf(type) < 0) {
            interestParkTypes.push(type);
          }
        });
      } else if (interest === 'nature') {
        nature.forEach((type) => {
          if (interestParkTypes.indexOf(type) < 0) {
            interestParkTypes.push(type);
          }
        });
      }
    });
  }

  return interestParkTypes;
};

export default customizeParks;
