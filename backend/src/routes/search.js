'use strict';

import { Router } from 'express';
import superagent from 'superagent';
import logger from '../lib/logger';

const searchRouter = new Router();

searchRouter.get('/search/:state', (request, response, next) => {
  logger.log(logger.INFO, `Searching for national parks in ${request.params.state}...`);

  const url = `https://api.nps.gov/api/v1/parks?stateCode=${request.params.state}&fields=images`;
  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then((parks) => {
      const filtered = parks.body.data.filter((park) => {
        if (park.url) {
          return park;
        }
        return 0;
      });
      return response.json(filtered);
    })
    .catch(next);
});

export default searchRouter;
