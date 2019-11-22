const validator = require('../index');

const emptyObject = {};
const stringObject = {'key': 'This is a string'};
const numberObject = {'key': 42};
const floatObject = {'key': 3.14};
const objectObject = {'key': {}};
const arrayObject = {'key': []};
const falseObject = {'key': false};
const trueObject = {'key': true};
const nullObject = {'key': null};
const undefinedObject = {'key': undefined};
const emptyRecursiveObject = {'key': {'key': {}}}

describe('number validation', () => {
    it('general type validation', () => {
        const blueprint = { definitions: { key: { type: 'number' } } };
        expect(validator(numberObject, blueprint)).toBe(true);
        expect(validator({'key': -1}, blueprint)).toBe(true);
        expect(validator(floatObject, blueprint)).toBe(true);
        expect(validator({'key': 2.99792458e8}, blueprint)).toBe(true);

        expect(validator({'key': '42'}, blueprint)).toBe(false);
        expect(validator(stringObject, blueprint)).toBe(false);
        expect(validator(objectObject, blueprint)).toBe(false);
        expect(validator(arrayObject, blueprint)).toBe(false);
        expect(validator(falseObject, blueprint)).toBe(false);
        expect(validator(trueObject, blueprint)).toBe(false);
        expect(validator(nullObject, blueprint)).toBe(false);
        expect(validator(undefinedObject, blueprint)).toBe(false);
    });

    it('has "multipleOf" defined', () => {
        const blueprint = { definitions: { key: { type: 'number', multipleOf: 10 } } };
        expect(validator({'key': 0}, blueprint)).toBe(true);
        expect(validator({'key': 10}, blueprint)).toBe(true);
        expect(validator({'key': 20}, blueprint)).toBe(true);
        expect(validator({'key': 23}, blueprint)).toBe(false);
    });

    it('has "minimum" defined', () => {
        const blueprint = { definitions: { key: { type: 'number', minimum: 0 } } };
        expect(validator({'key': 0}, blueprint)).toBe(true);
        expect(validator({'key': 10}, blueprint)).toBe(true);
        expect(validator({'key': 99}, blueprint)).toBe(true);

        expect(validator({'key': -1}, blueprint)).toBe(false);
    });

    it('has "exclusiveMinimum" defined', () => {
        const blueprint = { definitions: { key: { type: 'number', exclusiveMinimum: 0 } } };
        expect(validator({'key': 10}, blueprint)).toBe(true);
        expect(validator({'key': 99}, blueprint)).toBe(true);
        
        expect(validator({'key': 0}, blueprint)).toBe(false);
        expect(validator({'key': -1}, blueprint)).toBe(false);
    });

    it('has "maximum" defined', () => {
        const blueprint = { definitions: { key: { type: 'number', maximum: 0 } } };
        expect(validator({'key': 0}, blueprint)).toBe(true);
        expect(validator({'key': -1}, blueprint)).toBe(true);

        expect(validator({'key': 10}, blueprint)).toBe(false);
        expect(validator({'key': 99}, blueprint)).toBe(false);
    });

    it('has "exclusiveMaximum" defined', () => {
        const blueprint = { definitions: { key: { type: 'number', exclusiveMaximum: 0 } } };
        expect(validator({'key': -1}, blueprint)).toBe(true);

        expect(validator({'key': 0}, blueprint)).toBe(false);
        expect(validator({'key': 10}, blueprint)).toBe(false);
        expect(validator({'key': 99}, blueprint)).toBe(false);
    });

    it('has custom validator function defined', () => {
        const mockTrue = jest.fn().mockReturnValue(true);
        const mockFalse = jest.fn().mockReturnValue(false);

        const blueprintTrue = { definitions: { key: { type: 'number', validator: mockTrue } } };
        const blueprintFalse = { definitions: { key: { type: 'number', validator: mockFalse } } };

        expect(mockTrue).toBeCalledTimes(0);
        expect(validator(floatObject, blueprintTrue)).toBe(true);
        expect(mockTrue).toBeCalledTimes(1);

        expect(mockFalse).toBeCalledTimes(0);
        expect(validator(floatObject, blueprintFalse)).toBe(false);
        expect(mockFalse).toBeCalledTimes(1);
    });
});