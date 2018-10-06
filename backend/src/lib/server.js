'use strict';

import express from 'express';
import cors from 'cors';
import HttpError from 'http-errors';

import logger from './logger';
import models from '../models';
import searchRouter from '../routes/search';
import errorMiddleware from './error-middleware';

const CLIENT_URL = process.env.CLIENT_URL;

const app = express();
let server = null;

app.use(cors({ credentials: true, origin: CLIENT_URL }));

app.use(searchRouter);

app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 - not found - catch-all');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return models.sequelize
    .authenticate()
    .then(() => {
      logger.log(logger.INFO, 'Database connection established');

      return models.sequelize.sync({ logging: logger.info })
        .then(() => {
          server = app.listen(process.env.PORT, () => {
            logger.log(logger.INFO, `Server listening on port ${process.env.PORT}`);
          });
        });
    })
    .catch((error) => {
      logger.log(logger.INFO, `ERROR - Database connection error: ${error}`);
      return new HttpError(502, 'Unable to start server');
    });    
};

const stopServer = () => {
  return models.sequelize.close()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server disconnected');
      });
    });
};

export { startServer, stopServer };
