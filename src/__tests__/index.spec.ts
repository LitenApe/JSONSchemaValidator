const validator = require('../index');

const emptyObject = {};
const stringObject = {'key': 'value'};
const numberObject = {'key': 42};
const objectObject = {'key': {}};
const arrayObject = {'key': []};
const falseObject = {'key': false};
const trueObject = {'key': true};
const nullObject = {'key': null};
const emptyRecursiveObject = {'key': {'key': {}}}

describe('JSON Schema Validator', () => {
    describe('boolean as blueprint', () => {
        it('blueprint set as "false" always returns false', () => {
            expect(validator(emptyObject, false)).toBe(false);
            expect(validator(stringObject, false)).toBe(false);
            expect(validator(numberObject, false)).toBe(false);
            expect(validator(objectObject, false)).toBe(false);
            expect(validator(arrayObject, false)).toBe(false);
            expect(validator(falseObject, false)).toBe(false);
            expect(validator(trueObject, false)).toBe(false);
            expect(validator(nullObject, false)).toBe(false);
        });
    
        it('blueprint set as "true" always returns false', () => {
            expect(validator(emptyObject, true)).toBe(true);
            expect(validator(stringObject, true)).toBe(true);
            expect(validator(numberObject, true)).toBe(true);
            expect(validator(objectObject, true)).toBe(true);
            expect(validator(arrayObject, true)).toBe(true);
            expect(validator(falseObject, true)).toBe(true);
            expect(validator(trueObject, true)).toBe(true);
            expect(validator(nullObject, true)).toBe(true);
        });
    });

    describe('string validation', () => {
        it('has type "string" defined', () => {
            const blueprint = { definitions: { key: { type: 'string' } } };
            expect(validator(stringObject, blueprint)).toBe(true);
        });

        it('has type "number" defined', () => {
            const blueprint = { definitions: { key: { type: 'number' } } };
            expect(validator(stringObject, blueprint)).toBe(false);
        });

        it('has type "boolean" defined', () => {
            const blueprint = { definitions: { key: { type: 'boolean' } } };
            expect(validator(stringObject, blueprint)).toBe(false);
        });

        it('has type "array" defined', () => {
            const blueprint = { definitions: { key: { type: 'boolean' } } };
            expect(validator(stringObject, blueprint)).toBe(false);
        });

        it('has custom validator function defined', () => {
            const mockTrue = jest.fn().mockReturnValue(true);
            const mockFalse = jest.fn().mockReturnValue(false);

            const blueprintTrue = { definitions: { key: { type: 'string', validator: mockTrue } } };
            const blueprintFalse = { definitions: { key: { type: 'string', validator: mockFalse } } };

            expect(mockTrue).toBeCalledTimes(0);
            expect(validator(stringObject, blueprintTrue)).toBe(true);
            expect(mockTrue).toBeCalledTimes(1);

            expect(mockFalse).toBeCalledTimes(0);
            expect(validator(stringObject, blueprintFalse)).toBe(false);
            expect(mockFalse).toBeCalledTimes(1);
        });

        it('has "enum" defined', () => {
            const blueprint = { definitions: { key: { type: 'string', enum: ['value'] } } };
            expect(validator({'key': 'value'}, blueprint)).toBe(true);
            expect(validator({'key': 'invalid'}, blueprint)).toBe(false);
        });

        it('has "const" defined', () => {
            const blueprint = { definitions: { key: { type: 'string', const: 'value' } } };
            expect(validator({'key': 'value'}, blueprint)).toBe(true);
            expect(validator({'key': 'invalid'}, blueprint)).toBe(false);
        });

        it('has "minLength" defined', () => {
            const blueprint = { definitions: { key: { type: 'string', minLength: 2 } } };
            expect(validator({'key': 'value'}, blueprint)).toBe(true);
            expect(validator({'key': 'i'}, blueprint)).toBe(false);
        });

        it('has "maxLength" defined', () => {
            const blueprint = { definitions: { key: { type: 'string', maxLength: 5 } } };
            expect(validator({'key': 'value'}, blueprint)).toBe(true);
            expect(validator({'key': 'invalid'}, blueprint)).toBe(false);
        });
    });
});