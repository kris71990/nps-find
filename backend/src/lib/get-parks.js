'use strict';

import superagent from 'superagent';
import HttpError from 'http-errors';

import logger from './logger';
import models from '../models';

const getParks = (stateSelected) => {
  logger.log(logger.INFO, `Retrieving new data from API for ${stateSelected}`);
  
  const url = `https://api.nps.gov/api/v1/parks?stateCode=${stateSelected}&fields=images`;
  
  return superagent.get(url)
    .set('api_key', process.env.NPS_API_KEY)
    .type('application/json')
    .then((parks) => {
      logger.log(logger.INFO, `Found data and inserting ${stateSelected} in to database`);
      
      const total = parks.body.data.filter(park => park.url);

      // const typeObj = {};
      // total.forEach((park) => {
      //   if (typeObj[park.designation]) typeObj[park.designation] += 1;
      //   typeObj[park.designation] = 0;
      // });
      // // const keys = Object.keys(typeObj);

      return models.state.create({
        stateId: stateSelected,
        total: total.length,
      })
        .then(() => {
          logger.log(logger.INFO, `Inserting parks in ${stateSelected} into database`);

          const parksEntered = total.forEach((parkFound) => {
            let imgUrlStrings = '';
            let imgCaptionStrings = '';

            if (parkFound.images.length > 0) {
              parkFound.images.forEach((image) => {
                imgUrlStrings += `${image.url}\n`;
                imgCaptionStrings += `${image.title}\n`;
              });
            } else {
              imgUrlStrings = null;
              imgCaptionStrings = null;
            }

            return models.park.create({
              stateCode: stateSelected,
              parkCode: parkFound.parkCode,
              pKeyCode: `${stateSelected}-${parkFound.parkCode}`,
              description: parkFound.description,
              designation: parkFound.designation,
              directionsInfo: parkFound.directionsInfo,
              fullName: parkFound.fullName,
              imageUrl: imgUrlStrings,
              imageCaptions: imgCaptionStrings,
              latLong: parkFound.latLong, 
              name: parkFound.name,
              states: parkFound.states,
              url: parkFound.url,
              weatherInfo: parkFound.weatherInfo,
            });
          })
            .then(() => {
              return parksEntered;
            });
        })
        .catch(() => new HttpError(400, 'Unable to save to db'));
    })
    .catch(() => new HttpError(400, 'Unable to get park data from API'));
};

export default getParks;
