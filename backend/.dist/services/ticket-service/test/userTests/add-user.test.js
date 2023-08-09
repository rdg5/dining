"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const nock_1 = __importDefault(require("nock"));
const sinon_1 = __importDefault(require("sinon"));
const server_1 = require("../../entry-points/api/server");
const testHelpers = __importStar(require("../test-helpers"));
const createNewUser = __importStar(require("../../domain/user-use-case"));
let axiosAPIClient;
beforeAll(async () => {
    process.env.JWT_TOKEN_SECRET = testHelpers.exampleSecret;
    const apiConnection = await (0, server_1.startWebServer)();
    const axiosConfig = {
        baseURL: `http://127.0.0.1:${apiConnection.port}`,
        validateStatus: () => true,
        headers: {
            authorization: testHelpers.signValidTokenWithDefaultUser(),
        },
    };
    axiosAPIClient = axios_1.default.create(axiosConfig);
    nock_1.default.disableNetConnect();
    nock_1.default.enableNetConnect('127.0.0.1');
});
beforeEach(() => {
    nock_1.default.cleanAll();
    sinon_1.default.restore();
    (0, nock_1.default)('http://localhost/user/').get(`/1`).reply(200, {
        id: 1,
        name: 'John',
        terms: 45,
    });
});
afterAll(async () => {
    nock_1.default.enableNetConnect();
    (0, server_1.stopWebServer)();
});
describe('/api', () => {
    describe('POST /users', () => {
        test('When asked to save a new user, Then it saves it and returns the newly created user', async () => {
            const newUserToBeCreated = {
                username: 'newUser1',
                email: 'newUser1@example.com',
                password: 'password123',
            };
            const createdNewUser = {
                username: 'newUser1',
                email: 'newUser1@example.com',
            };
            const postResponse = await axiosAPIClient.post(`/api/users`, newUserToBeCreated);
            expect(postResponse.status).toBe(201);
            expect(postResponse.data).toHaveProperty('id');
            expect(typeof postResponse.data.id).toBe('number');
            const newUserId = postResponse.data.id;
            const getResponse = await axiosAPIClient.get(`/api/users/${newUserId}`);
            expect(getResponse.status).toBe(200);
            expect(getResponse.data).toMatchObject({
                ...createdNewUser,
                id: newUserId,
            });
        });
        test('When asked to save a new user with already existing username, Then it returns an error with status 409', async () => {
            const newUserToBeCreated = {
                username: 'newUser1',
                email: 'newUser1@example.com',
                password: 'password123',
            };
            const postResponse = await axiosAPIClient.post(`/api/users`, newUserToBeCreated);
            expect(postResponse.status).toBe(409);
            expect(postResponse.data).toHaveProperty('error');
            expect(typeof postResponse.data.error).toBe('string');
            expect(postResponse.data.error).toBe('Username already in use');
        });
        test('When asked to save a new user with already existing email, Then it returns an error with status 409', async () => {
            const newUserToBeCreated = {
                username: 'newUser999',
                email: 'newUser1@example.com',
                password: 'password123',
            };
            const postResponse = await axiosAPIClient.post(`/api/users`, newUserToBeCreated);
            expect(postResponse.status).toBe(409);
            expect(postResponse.data).toHaveProperty('error');
            expect(typeof postResponse.data.error).toBe('string');
            expect(postResponse.data.error).toBe('Email already in use');
        });
        test('When user creation fails, then it should return status 404', async () => {
            const createNewUserStub = sinon_1.default
                .stub(createNewUser, 'createNewUser')
                .returns(Promise.resolve(null));
            const newUserToBeCreated = {
                username: 'newUser999',
                email: 'newUser1@example.com',
                password: 'password123',
            };
            const postResponse = await axiosAPIClient.post(`/api/users`, newUserToBeCreated);
            expect(postResponse.status).toBe(404);
        });
    });
});
