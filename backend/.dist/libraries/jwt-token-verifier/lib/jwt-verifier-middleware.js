"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerifierMiddleware = void 0;
/* eslint-disable consistent-return */
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const WHITELISTED_ENDPOINTS = [
    '/auth/login',
    '/auth/register, /auth/refresh',
];
const jwtVerifierMiddleware = (options) => {
    // 🔒 TODO - Once your project is off a POC stage, change your JWT flow to async using JWKS
    // Read more here: https://www.npmjs.com/package/jwks-rsa
    const middleware = (req, res, next) => {
        // eslint-disable-next-line no-console
        if (WHITELISTED_ENDPOINTS.includes(req.url)) {
            next();
            return;
        }
        const authenticationHeader = req.headers.authorization || req.headers.Authorization;
        if (!authenticationHeader) {
            return res.sendStatus(401);
        }
        let token;
        const authHeaderParts = authenticationHeader.split(' ');
        if (authHeaderParts.length > 2) {
            return res.sendStatus(401);
        }
        if (authHeaderParts.length === 2) {
            [, token] = authHeaderParts;
        }
        else {
            token = authenticationHeader;
        }
        jsonwebtoken_1.default.verify(token, options.secret, 
        // TODO: we should remove this any according to the library, jwtContent can not contain data property
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err, jwtContent) => {
            // TODO use logger to report the error here
            if (err) {
                return res.sendStatus(401);
            }
            req.user = jwtContent.data;
            next();
        });
    };
    return middleware;
};
exports.jwtVerifierMiddleware = jwtVerifierMiddleware;
