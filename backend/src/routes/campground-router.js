'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import models from '../models';

const campgroundRouter = new Router();
const Op = models.Sequelize.Op;

campgroundRouter.get('/campgrounds/park/:parkKey', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get on /park/${request.params.parkKey}/campgrounds`);

  return models.campground.findAll({
    where: {
      parkId: { [Op.eq]: request.params.parkKey },
    },
  })
    .then((campgrounds) => {
      const filtered = campgrounds.filter(campground => campground.name.toLowerCase() !== 'a');
      logger.log(logger.INFO, `Returning all campgrounds in ${request.params.parkKey}`);
      return response.json(filtered);
    })
    .catch(next);
});

campgroundRouter.get('/campgrounds/:state', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get on /campgrounds/${request.params.state}`);

  return models.campground.findAll({
    where: {
      state: { [Op.eq]: request.params.state },
    },
  })
    .then((campgrounds) => {
      const filtered = campgrounds.filter(campground => campground.name.toLowerCase() !== 'a');
      logger.log(logger.INFO, `Returning all campgrounds in ${request.params.state}`);
      return response.json(filtered);
    })
    .catch(next);
});

export default campgroundRouter;
