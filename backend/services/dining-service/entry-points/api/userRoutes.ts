import express from 'express';
import { logger } from '@practica/logger';
import { AppError } from '@practica/error-handling';
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

  router.post('/', async (req, res, next) => {
    try {
      logger.info(`Order API was called to create a new user in the db`);
      const response = await userUseCase.createNewUser(req.body);

      if (!response) {
        res.status(404).end();
        return;
      }
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        next(error);
        res.status(error.HTTPStatus).json({ error: error.message });
      }
    }
  });

  expressApp.use('/api/users', router);
}
