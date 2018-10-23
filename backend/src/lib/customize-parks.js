'use strict';

const history = [
  'National Military Park', 
  'National Battlefield', 
  'National Battlefield Park', 
  'National Battlefield Site', 
  'National Historic Area',
  'National Heritage Area',
  'National Historic Site',
  'National Historic Park',
  'National Historical Park and Preserve',
  'National Historic Trail',
  'International Historic Site',
  'National Memorial',
];

const hiking = [
  'National Recreation Area',
  'National Preserve',
  'National Geologic Trail',
  'National Park & Preserve',
  'National Park',
  'National Historic Trail',
  'National Reserve',
  'National Trail System',
];

const nature = [
  'National Preserve',
  'National Geologic Trail',
  'National Park & Preserve',
  'National Park',
  'Wild River',
  'National Parkway',
  'National Monument & Preserve',
  'National Lakeshore',
  'National Seashore',
  'National Reserve',
  'National River',
  'National Wild & Scenic River & Riverway',
];

const customizeParks = (query) => {
  let reqArr;
  if (query.interests && typeof query.interests === 'string') {
    reqArr = [query.interests];
  } else {
    reqArr = query.interests;
  }

  let interestParkTypes;

  if (reqArr) {
    for (let i = 0; i < reqArr.length; i++) {
      if (reqArr[i] === 'history') {
        interestParkTypes = history;
      } else if (reqArr[i] === 'hiking') {
        interestParkTypes = hiking;
      } else if (reqArr[i] === 'nature') {
        interestParkTypes = nature;
      }
    }
  }

  return interestParkTypes;
};

export default customizeParks;
