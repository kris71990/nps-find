'use strict';

import { Router } from 'express';
// import HttpError from 'http-errors';
// import superagent from 'superagent';
import logger from '../lib/logger';
import models from '../models';

import getData from '../lib/get-parks';

const stateRouter = new Router();

stateRouter.get('/state/:state', (request, response, next) => {
  logger.log(logger.INFO, `Searching for national parks in ${request.params.state}...`);

  models.state.findAll({
    where: {
      stateId: request.params.state,
    },
  })
    .then((results) => {
      if (results.length > 0) return results;

      return getData(request.params.state)
        .then((response2) => {
          return response.json(response2);
        })
        .catch(next);
    })
    .catch(next);
  // const url = `https://api.nps.gov/api/v1/parks?stateCode=${request.params.state}&fields=images`;

  // return superagent.get(url)
  //   .set('api_key', process.env.NPS_API_KEY)
  //   .type('application/json')
  //   .then((parks) => {
  //     logger.log(logger.INFO, `Returning national parks in ${request.params.state}`);
      
  //     const filtered = parks.body.data.filter(park => park.url);
  //     return models.state.findOrCreate({
  //       where: {
  //         stateCode: request.params.state,
  //       },
  //       defaults: {
  //         totalParks: null,
  //       },
  //     })
//         .then(() => {
//           filtered.forEach((parkFound) => {
//             return models.park.create({
//               stateCode: request.params.state,
//               parkCode: parkFound.parkCode,
//               description: parkFound.description,
//             });
//           })
//             .then(() => {
//               // return models.state.findOne({
//               //   where: {
//               //     stateCode: request.
//               //   }
//               // })
//               return response.json(filtered);
//             });
//         })
//         .catch(next);
//     })
//     .catch(next);
// })
// .catch(next);
});

export default stateRouter;
