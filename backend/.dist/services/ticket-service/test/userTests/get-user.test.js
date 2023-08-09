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
const error_handling_1 = require("@practica/error-handling");
const server_1 = require("../../entry-points/api/server");
const testHelpers = __importStar(require("../test-helpers"));
const userUseCase = __importStar(require("../../domain/user-use-case"));
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
describe('/api/roles', () => {
    describe('GET /users', () => {
        test('When asked for existing users, Then should retrieve and receive 200 response along with existing fields', async () => {
            const getResponse = await axiosAPIClient.get(`/api/users`);
            expect(getResponse).toMatchObject({
                status: 200,
            });
            expect(Array.isArray(getResponse.data)).toBeTruthy();
            getResponse.data.forEach((user) => {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('username');
                expect(user).toHaveProperty('email');
            });
        });
    });
    test('When asked for existing users, Then should retrieve them and receive 200 response ', async () => {
        const existingUsers = [
            {
                id: 1,
                username: 'user1',
                email: 'user1@example.com',
            },
            {
                id: 2,
                username: 'user2',
                email: 'user2@example.com',
            },
            {
                id: 3,
                username: 'user3',
                email: 'user3@example.com',
            },
        ];
        const getResponse = await axiosAPIClient.get(`/api/users`);
        expect(getResponse).toMatchObject({
            status: 200,
        });
        expect(getResponse.data).toMatchObject(existingUsers);
    });
});
test('When asked for one specific user by id, Then should retrieve it and receive 200 response', async () => {
    const foundUser = { id: 1, username: 'user1', email: 'user1@example.com' };
    const getOneUserResponse = await axiosAPIClient.get(`/api/users/1`);
    expect(getOneUserResponse).toMatchObject({
        status: 200,
    });
    expect(getOneUserResponse.data).toMatchObject(foundUser);
});
test('When asked for a non-existent user by id, Then should retrieve error and receive 404 response', async () => {
    const errorResponse = { error: 'User not found' };
    const getNonExistentUserResponse = await axiosAPIClient.get(`/api/users/999`);
    expect(getNonExistentUserResponse).toMatchObject({
        status: 404,
    });
    expect(getNonExistentUserResponse.data).toMatchObject(errorResponse);
});
test('When asked for a user by non-valid number id, Then should retrieve error and receive 400 response', async () => {
    const errorResponse = { error: 'userId must be a valid number.' };
    const getNonExistentUserResponse = await axiosAPIClient.get(`/api/users/-200`);
    expect(getNonExistentUserResponse).toMatchObject({
        status: 400,
    });
    expect(getNonExistentUserResponse.data).toMatchObject(errorResponse);
});
test('When user retrieval fails, then it should return status 404', async () => {
    const getUsersStub = sinon_1.default
        .stub(userUseCase, 'getUsers')
        .returns(Promise.resolve(null));
    const postResponse = await axiosAPIClient.get(`/api/users`);
    expect(postResponse.status).toBe(404);
});
test('When asked for a user by string instead of number as id, Then should retrieve error and receive 400 response', async () => {
    const errorResponse = { error: 'userId must be a valid number.' };
    const getNonExistentUserResponse = await axiosAPIClient.get(`/api/users/john`);
    expect(getNonExistentUserResponse).toMatchObject({
        status: 400,
    });
    expect(getNonExistentUserResponse.data).toMatchObject(errorResponse);
});
test('When error is thrown in get all users, Then should pass the error to the next function', async () => {
    const mockError = new error_handling_1.AppError('validation-failed', 'An error occurred', 500);
    const getUsersStub = sinon_1.default.stub(userUseCase, 'getUsers').throws(mockError);
    try {
        await axiosAPIClient.get(`/api/users`);
    }
    catch (error) {
        if (error instanceof error_handling_1.AppError) {
            expect(error.HTTPStatus).toBe(mockError.HTTPStatus);
            expect(error.message).toEqual({ error: mockError.message });
        }
    }
});
test('When error is thrown in get one user, Then should pass the error to the next function', async () => {
    const mockError = new error_handling_1.AppError('validation-failed', 'An error occurred', 500);
    const getoneUserStub = sinon_1.default
        .stub(userUseCase, 'getUserById')
        .throws(mockError);
    try {
        await axiosAPIClient.get(`/api/users/999`);
    }
    catch (error) {
        if (error instanceof error_handling_1.AppError) {
            expect(error.HTTPStatus).toBe(mockError.HTTPStatus);
            expect(error.message).toEqual({ error: mockError.message });
        }
    }
});
