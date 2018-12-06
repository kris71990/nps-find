'use strict';

import logger from './logger';

const filterUserParks = (parks, key) => {
  logger.log(logger.INFO, 'Condensing parks found from user query and updating report numbers');

  const filtered = {};
  parks.forEach((park) => {
    if (!filtered[park.pKeyCode]) {
      filtered[park.pKeyCode] = park;
    } else {
      filtered[park.pKeyCode][key] += `,${park[key]}`;
      const reportNumber = Number(filtered[park.pKeyCode].reports);
      filtered[park.pKeyCode].reports = reportNumber + Number(park.reports);
    }
  });
  const filteredParks = Object.values(filtered);
  return filteredParks;
};

const generateUserSQLQuery = (joinType, searchField, joinAs, rx) => {
  logger.log(logger.INFO, 'Generating SQL query');

  return `SELECT * FROM parks ${joinType.toUpperCase()} JOIN (SELECT "${searchField}", "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId", "${searchField}") AS ${joinAs} ON "pKeyCode"="parkId" WHERE "${searchField}" ~* '${rx}';`;
};

export { filterUserParks, generateUserSQLQuery };
