/* eslint-disable consistent-return */
import jwt, { VerifyErrors } from 'jsonwebtoken';
// eslint-disable-next-line import/no-extraneous-dependencies
import { logger } from '@practica/logger';

export type JWTOptions = {
  secret: string;
};

const WHITELISTED_ENDPOINTS: string[] = [
  '/auth/register',
  '/auth/login',
  '/auth/refresh',
];

export const jwtVerifierMiddleware = (options: JWTOptions) => {
  // 🔒 TODO - Once your project is off a POC stage, change your JWT flow to async using JWKS
  // Read more here: https://www.npmjs.com/package/jwks-rsa
  const middleware = (req, res, next) => {
    // eslint-disable-next-line no-console
    if (WHITELISTED_ENDPOINTS.includes(req.url)) {
      next();
      return;
    }

    const { accessToken, refreshToken } = req.cookies;

    const authenticationHeader =
      req.headers.authorization || req.headers.Authorization;

    if (!accessToken || !refreshToken) {
      return res.sendStatus(401);
    }

    jwt.verify(
      accessToken,
      options.secret,
      // TODO: we should remove this any according to the library, jwtContent can not contain data property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: VerifyErrors | null, jwtContent: any) => {
        // TODO use logger to report the error here

        if (err) {
          return res.sendStatus(401);
        }

        req.user = jwtContent.data;

        next();
      }
    );
  };
  return middleware;
};
