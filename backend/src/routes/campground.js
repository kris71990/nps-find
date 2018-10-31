'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import models from '../models';

const campgroundRouter = new Router();

campgroundRouter.get('/campgrounds/:parkKey', (request, response, next) => {
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

export default campgroundRouter;
