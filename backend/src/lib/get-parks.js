'use strict';

import superagent from 'superagent';
import HttpError from 'http-errors';

import logger from './logger';
import models from '../models';

const getParks = (stateSelected) => {
  const url = `https://api.nps.gov/api/v1/parks?stateCode=${stateSelected}&fields=images`;
  
  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then((parks) => {
      logger.log(logger.INFO, `Returning national parks in ${stateSelected}`);
      
      const filtered = parks.body.data.filter(park => park.url);
      models.state.create({
        stateId: stateSelected,
        totalParks: null,
      })
        .then(() => {
          return filtered;
        })
        .catch(() => new HttpError(400, 'Unable to save to db'));
    })
    .catch(() => new HttpError(400, 'Unable to get park data from API'));
};

export default getParks;
