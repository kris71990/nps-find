'use strict';

import superagent from 'superagent';

import logger from './logger';
import models from '../models';

const getCampgrounds = (state) => {
  logger.log(logger.INFO, `Finding campgrounds in ${state}`);
  const url = `https://api.nps.gov/api/v1/campgrounds?stateCode=${state}`;

  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then((campgroundsRaw) => {
      const campgroundsBody = campgroundsRaw.body.data.filter(campground => campground.name);

      return campgroundsBody.forEach((campground) => {
        return models.campground.create({
          parkId: `${state}-${campground.parkCode}`,
          name: campground.name,
          description: campground.description,
          latLong: campground.latLong,
          directionsOverview: campground.directionsOverview,
          campsites: campground.campsites,
          amenities: campground.amenities,
          accessibility: campground.accessibility,
        });
      });
    });
};

export default getCampgrounds;
