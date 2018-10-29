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
      return response.json(campgrounds);
    })
    .catch(next);
});

export default campgroundRouter;
