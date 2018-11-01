'use strict';

import superagent from 'superagent';

import logger from './logger';
import models from '../models';

const getCampgrounds = (state) => {
  const url = `https://api.nps.gov/api/v1/campgrounds?stateCode=${state}`;

  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then((campgroundsRaw) => {
      const campgroundsBody = campgroundsRaw.body.data.filter((campground) => {
        if (!campground.name || campground.name.toLowerCase() === 'a') return null;
        return campground;
      });

      const uniqueCgs = {};
      campgroundsBody.forEach((cg) => {
        if (!uniqueCgs[cg.name]) uniqueCgs[cg.name] = cg;
        return null;
      });

      const totalCgs = Object.keys(uniqueCgs).length;
      logger.log(logger.INFO, `Inserting ${totalCgs} campgrounds in ${state}`);

      return Object.keys(uniqueCgs).forEach((campgroundName) => {
        return models.campground.create({
          parkId: `${state}-${uniqueCgs[campgroundName].parkCode}`,
          state,
          name: uniqueCgs[campgroundName].name,
          description: uniqueCgs[campgroundName].description,
          latLong: uniqueCgs[campgroundName].latLong,
          directionsOverview: uniqueCgs[campgroundName].directionsOverview,
          campsites: uniqueCgs[campgroundName].campsites,
          amenities: uniqueCgs[campgroundName].amenities,
          accessibility: uniqueCgs[campgroundName].accessibility,
        });
      });
    });
};

export default getCampgrounds;
