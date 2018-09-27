'use strict';

import { Router } from 'express';
import superagent from 'superagent';
import logger from '../lib/logger';

const searchRouter = new Router();

searchRouter.get('/search', (request, response, next) => {
  logger.log(logger.INFO, 'Searching for national parks in California...');

  const url = 'https://api.nps.gov/api/v1/parks?stateCode=CA';
  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then(parks => response.json(parks.body))
    .catch(next);
});

export default searchRouter;
