import express from 'express';
import { logger } from '@practica/logger';
import { AppError } from '@practica/error-handling';
import * as authUseCase from '../../domain/auth-use-case';

export default function defineUserRoutes(expressApp: express.Application) {
  const router = express.Router();

  router.post('/register', async (req, res, next) => {
    try {
      logger.info(`Auth API was called to register a new user`);
      const response = await authUseCase.register(req.body);

      if (!response) {
        res.status(404).end();
        return;
      }
      res.status(201).json({ status: 'ok' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.HTTPStatus).json({ error: error.message });
        next(error);
      }
    }
  });

  router.post('/login', async (req, res, next) => {
    try {
      logger.info(`Auth API was called to login a user`);
      const response = await authUseCase.login(req.body);

      if (!response) {
        res.status(404).end();
        return;
      }
      res.cookie('accessToken', response.jwtToken, {
        httpOnly: true,
        path: '/',
        maxAge: 1000 * 60 * 20,
      });

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      // eslint-disable-next-line no-console
      console.log(res);
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.HTTPStatus).json({ error: error.message });
        next(error);
      }
    }
  });

  router.post('/refresh', async (req, res, next) => {
    const { accessToken, refreshToken } = req.cookies;
    try {
      logger.info(`Auth API was called to refresh an expired token`);
      const response = authUseCase.refreshTokenGenerator(
        accessToken,
        refreshToken
      );

      if (!response) {
        res.status(404).end();
        return;
      }

      res.cookie('accessToken', response.newAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 20,
      });

      res.cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.HTTPStatus).json({ error: error.message });
        next(error);
      }
    }
  });

  expressApp.use('/auth', router);
}
