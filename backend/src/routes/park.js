'use strict';

import { Router } from 'express';
import logger from '../lib/logger';
import models from '../models';

import getData from '../lib/get-parks';

const parkRouter = new Router();

parkRouter.get('/parks/:state', (request, response, next) => {
  logger.log(logger.INFO, `Processing a get for /parks/${request.params.state}...`);

  let reqArr;
  if (request.query.interests && typeof request.query.interests === 'string') {
    reqArr = [request.query.interests];
  } else {
    reqArr = request.query.interests;
  }

  const interestParkTypes = [];

  if (reqArr) {
    for (let i = 0; i < reqArr.length; i++) {
      if (reqArr[i] === 'history') {
        interestParkTypes.push('National Military Park');
        interestParkTypes.push('National Battlefield');
        interestParkTypes.push('National Battlefield Park');
        interestParkTypes.push('National Battlefield Site');
        interestParkTypes.push('National Historic Area');
        interestParkTypes.push('National Heritage Area');
        interestParkTypes.push('National Historic Site');
        interestParkTypes.push('National Historic Park');
        interestParkTypes.push('National Historical Park and Preserve');
        interestParkTypes.push('National Historic Trail');
        interestParkTypes.push('International Historic Site');
        interestParkTypes.push('National Memorial');
      } else if (reqArr[i] === 'hiking') {
        interestParkTypes.push('National Recreation Area');
        interestParkTypes.push('National Preserve');
        interestParkTypes.push('National Geologic Trail');
        interestParkTypes.push('National Park & Preserve');
        interestParkTypes.push('National Park');
        interestParkTypes.push('National Historic Trail');
        interestParkTypes.push('National Reserve');
        interestParkTypes.push('National Trail System');
      } else if (reqArr[i] === 'nature') {
        interestParkTypes.push('National Preserve');
        interestParkTypes.push('National Geologic Trail');
        interestParkTypes.push('National Park & Preserve');
        interestParkTypes.push('National Park');
        interestParkTypes.push('Wild River');
        interestParkTypes.push('National Parkway');
        interestParkTypes.push('National Monument & Preserve');
        interestParkTypes.push('National Lakeshore');
        interestParkTypes.push('National Seashore');
        interestParkTypes.push('National Reserve');
        interestParkTypes.push('National River');
        interestParkTypes.push('National Wild & Scenic River & Riverway');
      }
    }
  }

  const reducedParkTypes = [...new Set(interestParkTypes)];

  // find if state exists in db
  return models.state.findAll({
    where: {
      stateId: request.params.state,
    },
  })
    .then((results) => {
      // if it exists, return all parks associated with the state
      if (results.length > 0) {
        logger.log(logger.INFO, `Returning park data from db for ${request.params.state}`);

        if (reducedParkTypes.length === 0) {
          return models.park.findAll({
            where: {
              stateCode: request.params.state,
            },
          })
            .then((retrievedParks) => {
              return response.json(retrievedParks);
            });
        }
        return models.park.findAll({
          where: {
            stateCode: request.params.state,
            designation: reducedParkTypes,
          },
        })
          .then((retrievedParks) => {
            return response.json(retrievedParks);
          });
      }

      // if it doesn't, call this function to get data from the api
      return getData(request.params.state)
        .then(() => {
          if (reducedParkTypes.length === 0) {
            return models.park.findAll({
              where: {
                stateCode: request.params.state,
              },
            })
              .then((retrievedParks) => {
                return response.json(retrievedParks);
              });
          }
          return models.park.findAll({
            where: {
              stateCode: request.params.state,
              designation: reducedParkTypes,
            },
          })
            .then((retrievedParks) => {
              return response.json(retrievedParks);
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

export default parkRouter;
