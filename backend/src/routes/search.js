'use strict';

import { Router } from 'express';
import superagent from 'superagent';
import logger from '../lib/logger';
// import State from '../models/state';

const searchRouter = new Router();

searchRouter.get('/search/:state', (request, response, next) => {
  logger.log(logger.INFO, `Searching for national parks in ${request.params.state}...`);

  const url = `https://api.nps.gov/api/v1/parks?stateCode=${request.params.state}&fields=images`;
  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then((parks) => {
      logger.log(logger.INFO, `Returning national parks in ${request.params.state}`);
      const filtered = parks.body.data.filter(park => park.url);
      // State.create();
      return response.json(filtered);
    })
    .catch(next);
});

export default searchRouter;
