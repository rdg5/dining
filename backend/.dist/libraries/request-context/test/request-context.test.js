"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const index_1 = require("../index");
describe('request-context', () => {
    test('When instantiating a new context with initial values, then should get back the context', () => {
        // Arrange
        const getCurrentRequestContext = sinon_1.default.spy(() => (0, index_1.context)().getStore());
        const initialContext = { requestId: 'a' };
        // Act
        (0, index_1.context)().run({ ...initialContext }, getCurrentRequestContext);
        // Assert
        expect({
            getStoreSpyReturnValue: getCurrentRequestContext.returnValues[0],
        }).toEqual({
            getStoreSpyReturnValue: initialContext,
        });
    });
    test('When instantiating a new context and putting a key, then get back the key value', () => {
        // Arrange
        const getCurrentRequestContext = sinon_1.default.spy(() => (0, index_1.context)().getStore());
        // Act
        (0, index_1.context)().run({}, () => {
            (0, index_1.context)().getStore().requestId = 'a';
            getCurrentRequestContext();
        });
        // Assert
        expect({
            getStoreSpyReturnValue: getCurrentRequestContext.returnValues[0],
        }).toEqual({
            getStoreSpyReturnValue: {
                requestId: 'a',
            },
        });
    });
});
