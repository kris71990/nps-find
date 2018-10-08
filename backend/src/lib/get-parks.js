'use strict';

import superagent from 'superagent';
import HttpError from 'http-errors';

import logger from './logger';
import models from '../models';

const getParks = (stateSelected) => {
  logger.log(logger.INFO, `Retrieving new data from API for ${stateSelected}`);

  const url = `https://api.nps.gov/api/v1/parks?stateCode=${stateSelected}&fields=images`;
  
  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then((parks) => {
      logger.log(logger.INFO, `Found data and inserting ${stateSelected} in to database`);
      
      const filtered = parks.body.data.filter(park => park.url);
      return models.state.create({
        stateId: stateSelected,
        totalParks: filtered.length,
      })
        .then(() => {
          logger.log(logger.INFO, `Inserting parks in ${stateSelected} into database`);

          filtered.forEach((parkFound) => {
            models.park.create({
              stateCode: stateSelected,
              parkCode: parkFound.parkCode,
              pKeyCode: `${stateSelected}-${parkFound.parkCode}`,
              description: parkFound.description,
            });
          });
          return filtered;
        })
        .catch(() => new HttpError(400, 'Unable to save to db'));
    })
    .catch(() => new HttpError(400, 'Unable to get park data from API'));
};

export default getParks;
