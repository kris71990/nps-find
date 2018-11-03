'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import models from '../models';

const campgroundRouter = new Router();

campgroundRouter.get('/campgrounds/park/:parkKey', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get on /park/${request.params.parkKey}/campgrounds`);

  return models.campground.findAll({
    where: {
      parkId: request.params.parkKey,
    },
  })
    .then((campgrounds) => {
      const filtered = campgrounds.filter(campground => campground.name.toLowerCase() !== 'a');
      return response.json(filtered);
    })
    .catch(next);
});

campgroundRouter.get('/campgrounds/:state', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get on /campgrounds/${request.params.state}`);

  return models.campground.findAll({
    where: {
      state: request.params.state,
    },
  })
    .then((campgrounds) => {
      const filtered = campgrounds.filter(campground => campground.name.toLowerCase() !== 'a');
      return response.json(filtered);
    })
    .catch(next);
});

export default campgroundRouter;
