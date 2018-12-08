'use strict';

import logger from './logger';

const filterUserParks = (parks, key, rx) => {
  logger.log(logger.INFO, `Condensing parks - ${parks.length} parks filtered by ${key} with regex '${rx}'`);

  // suburban environment does not update report total, likely due to problem with regex \b string

  const filtered = {};
  parks.forEach((park) => {
    if (!filtered[park.pKeyCode]) {
      if (key === 'weather') {
        if ((park[key] && park[key].match(rx)) || park.weatherInfo.match(rx)) filtered[park.pKeyCode] = park;
      } else if (park[key].match(rx)) filtered[park.pKeyCode] = park;
    } else {
      filtered[park.pKeyCode][key] += `,${park[key]}`;
      const reportNumber = Number(filtered[park.pKeyCode].reports);
      filtered[park.pKeyCode].reports = reportNumber + Number(park.reports);
    }
  });
  const filteredParks = Object.values(filtered);
  return filteredParks;
};

const generateRx = (searchType, prefs) => {
  logger.log(logger.INFO, 'Generating Regex');
  let rx = '';

  switch (searchType) {
    case 'parkEnvironment':
      rx = `(\\b${prefs[0]})|(\\b${prefs[1]})`;
      logger.log(logger.INFO, `Regex created for ${searchType} search - ${rx}`);
      return rx;
    case 'weather':
      prefs.forEach((pref, i) => {
        rx += `(${pref.trim()})`; 
        if (i !== prefs.length - 1) rx += '|';
      });
      logger.log(logger.INFO, `Regex created for ${searchType} search - ${rx}`);
      return rx;
    case 'parkLandscape':
      prefs.forEach((pref, i) => {
        rx += `(\\b${pref.trim()})`; 
        if (i !== prefs.length - 1) rx += '|';
      });
      logger.log(logger.INFO, `Regex created for ${searchType} search - ${rx}`);
      return rx;
    default:
      return null;
  }
};

const generateUserSQLQuery = (joinType, searchField, joinAs, rx) => {
  logger.log(logger.INFO, 'Generating SQL query');

  let query = `SELECT * FROM parks ${joinType.toUpperCase()} JOIN (SELECT "${searchField}", "parkId", COUNT(*) as "reports" FROM reports GROUP BY "parkId", "${searchField}") AS ${joinAs} ON "pKeyCode"="parkId"`;

  if (searchField === 'weather') {
    query += ` WHERE "weatherInfo" ~* '${rx}' OR "weather" ~* '${rx}';`;
  } else {
    query += ';';
  }

  return query;
};

export { filterUserParks, generateRx, generateUserSQLQuery };
