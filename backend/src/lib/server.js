'use strict';

import express from 'express';
import cors from 'cors';
import HttpError from 'http-errors';
import Sequelize from 'sequelize';

import logger from './logger';
import searchRouter from '../routes/search';
import errorMiddleware from './error-middleware';

const app = express();
let server = null;

const CLIENT_URL = process.env.CLIENT_URL;
const DATABASE_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(DATABASE_URL);

app.use(cors({ credentials: true, origin: CLIENT_URL }));

app.use(searchRouter);

app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 - not found - catch-all');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return sequelize
    .authenticate()
    .then(() => {
      logger.log(logger.INFO, 'Database connection established');
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server listening on port ${process.env.PORT}`);
      });
    })
    .catch((error) => {
      logger.log(logger.INFO, `ERROR - Database connection error: ${error}`);
      return new HttpError(502, 'Unable to start server');
    });
};

const stopServer = () => {
  return sequelize.close()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server disconnected');
      });
    });
};

export { startServer, stopServer };
