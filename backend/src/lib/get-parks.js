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

      return models.state.create({
        stateId: stateSelected,
        total: total.length,
      })
        .then(() => {
          logger.log(logger.INFO, `Inserting parks in ${stateSelected} into database`);

          const parksEntered = total.forEach((parkFound) => {
            let imgUrlStrings = '';
            let imgCaptionStrings = '';
            let designationString = null;

            if (parkFound.designation === '') {
              designationString = 'Other';
            } else {
              designationString = parkFound.designation.trim();
            }

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
              parkCode: parkFound.parkCode.trim(),
              pKeyCode: `${stateSelected}-${parkFound.parkCode}`,
              description: parkFound.description.trim(),
              designation: designationString,
              directionsInfo: parkFound.directionsInfo.trim(),
              fullName: parkFound.fullName.trim(),
              imageUrl: imgUrlStrings,
              imageCaptions: imgCaptionStrings,
              latLong: parkFound.latLong.trim(), 
              name: parkFound.name.trim(),
              states: parkFound.states.trim(),
              url: parkFound.url.trim(),
              weatherInfo: parkFound.weatherInfo.trim(),
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
