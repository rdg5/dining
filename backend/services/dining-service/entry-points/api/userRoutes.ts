import express from 'express';
import { logger } from '@practica/logger';
import * as userUseCase from '../../domain/user-use-case';

export default function defineUserRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info(`Order API was called to get all users from db`);
      const response = await userUseCase.getUsers();

      if (!response) {
        res.status(404).end();
        return;
      }

      res.json(response);
    } catch (error) {
      next(error);
    }
  });

  expressApp.use('/api/users', router);
}
