import express from 'express';
import { logger } from '@practica/logger';

export default function defineRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.get('/hello', async (req, res, next) => {
    try {
      logger.info(`Hello API was called`);

      res.json('hello');
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/', router);
}
