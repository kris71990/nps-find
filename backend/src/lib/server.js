'use strict';

import express from 'express';
import cors from 'cors';
// import mongoose from 'mongoose';
// import HttpError from 'http-errors';

import logger from './logger';
import searchRouter from '../routes/search';
import errorMiddleware from './error-middleware';

const app = express();
let server = null;

app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));

app.use(searchRouter);

app.all('*', (request, response) => {
  logger.log(logger.INFO, '404 - not found - catch-all');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  server = app.listen(process.env.PORT, () => {
    logger.log(logger.INFO, `Server listening on port ${process.env.PORT}`);
  });
};

const stopServer = () => {
  server.close(() => {
    logger.log(logger.INFO, 'Server disconnected');
  });
};

export { startServer, stopServer };
