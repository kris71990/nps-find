'use strict';

import superagent from 'superagent';

import logger from './logger';
import models from '../models';

const getCampgrounds = () => {
  let camping;
  const url = `https://api.nps.gov/api/v1/campgrounds?parkCode={}`;
};

export default getCampgrounds;
