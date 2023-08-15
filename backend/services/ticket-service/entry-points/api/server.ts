/* eslint-disable no-console */
import { Server } from 'http';
import { logger } from '@practica/logger';
import { AddressInfo } from 'net';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from '@practica/error-handling';
import * as configurationProvider from '@practica/configuration-provider';
import { jwtVerifierMiddleware } from '@practica/jwt-token-verifier';
import { addRequestIdExpressMiddleware } from '@practica/request-context';
import cookies from 'cookie-parser';
import cors from 'cors';
import configurationSchema from '../../config';
import defineUserRoutes from './userRoutes';
import getDbConnection from '../../data-access/models/db-connection';
import defineRoleRoutes from './roleRoutes';
import defineTeamRoutes from './teamRoutes';
import definePermissionRoutes from './permissionRoutes';
import defineAuthRoutes from './authRoutes';

let connection: Server;

async function startWebServer(): Promise<AddressInfo> {
  configurationProvider.initializeAndValidate(configurationSchema);
  logger.configureLogger(
    {
      prettyPrint: Boolean(
        configurationProvider.getValue('logger.prettyPrint')
      ),
    },
    true
  );
  await getDbConnection();

  const expressApp = express();
  expressApp.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({ extended: true }));
  expressApp.use(cookies());
  expressApp.use((req, res, next) => {
    console.log(req.headers);
    console.log(req.cookies);
    next();
  });
  expressApp.use(
    jwtVerifierMiddleware({
      secret: configurationProvider.getValue('jwtTokenSecret'),
    })
  );
  defineUserRoutes(expressApp);
  defineAuthRoutes(expressApp);
  defineRoleRoutes(expressApp);
  defineTeamRoutes(expressApp);
  definePermissionRoutes(expressApp);
  expressApp.use(addRequestIdExpressMiddleware);
  expressApp.use(helmet());
  defineErrorHandlingMiddleware(expressApp);
  const APIAddress = await openConnection(expressApp);
  return APIAddress;
}

async function stopWebServer() {
  return new Promise<void>((resolve) => {
    if (connection !== undefined) {
      connection.close(() => {
        resolve();
      });
    }
  });
}

async function openConnection(
  expressApp: express.Application
): Promise<AddressInfo> {
  return new Promise((resolve) => {
    const portToListenTo = configurationProvider.getValue('port');
    const webServerPort = portToListenTo || 0;
    logger.info(`Server is about to listen to port ${webServerPort}`);
    connection = expressApp.listen(webServerPort, () => {
      errorHandler.listenToErrorEvents(connection);
      resolve(connection.address() as AddressInfo);
    });
  });
}

function defineErrorHandlingMiddleware(expressApp: express.Application) {
  expressApp.use(
    async (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: any,
      req: express.Request,
      res: express.Response,
      // Express requires next function in default error handlers
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      next: express.NextFunction
    ) => {
      if (error && typeof error === 'object') {
        if (error.isTrusted === undefined || error.isTrusted === null) {
          error.isTrusted = true; // Error during a specific request is usually not fatal and should not lead to process exit
        }
      }
      errorHandler.handleError(error);
      res.status(error?.HTTPStatus || 500).end();
    }
  );
}

export { startWebServer, stopWebServer };
