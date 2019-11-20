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

describe('JSON Schema Validator', () => {
    describe('boolean as blueprint', () => {
        it('blueprint set as "false" always returns false', () => {
            expect(validator(emptyObject, false)).toBe(false);
            expect(validator(stringObject, false)).toBe(false);
            expect(validator(numberObject, false)).toBe(false);
            expect(validator(floatObject, false)).toBe(false);
            expect(validator(objectObject, false)).toBe(false);
            expect(validator(arrayObject, false)).toBe(false);
            expect(validator(falseObject, false)).toBe(false);
            expect(validator(trueObject, false)).toBe(false);
            expect(validator(nullObject, false)).toBe(false);
            expect(validator(undefinedObject, false)).toBe(false);
        });
    
        it('blueprint set as "true" always returns false', () => {
            expect(validator(emptyObject, true)).toBe(true);
            expect(validator(stringObject, true)).toBe(true);
            expect(validator(numberObject, true)).toBe(true);
            expect(validator(floatObject, false)).toBe(false);
            expect(validator(objectObject, true)).toBe(true);
            expect(validator(arrayObject, true)).toBe(true);
            expect(validator(falseObject, true)).toBe(true);
            expect(validator(trueObject, true)).toBe(true);
            expect(validator(nullObject, true)).toBe(true);
            expect(validator(undefinedObject, true)).toBe(true);
        });
    });

    describe('string validation', () => {
        it('general type validation', () => {
            const blueprint = { definitions: { key: { type: 'string' } } };
            expect(validator(stringObject, blueprint)).toBe(true);
            expect(validator({'key': 'Déjà vu'}, blueprint)).toBe(true);
            expect(validator({'key': ''}, blueprint)).toBe(true);
            expect(validator({'key': '42'}, blueprint)).toBe(true);

            expect(validator(numberObject, blueprint)).toBe(false);
            expect(validator(floatObject, blueprint)).toBe(false);
            expect(validator(objectObject, blueprint)).toBe(false);
            expect(validator(arrayObject, blueprint)).toBe(false);
            expect(validator(falseObject, blueprint)).toBe(false);
            expect(validator(trueObject, blueprint)).toBe(false);
            expect(validator(nullObject, blueprint)).toBe(false);
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

        it('has "pattern" defined', () => {
            const blueprint = {
                definitions: {
                    key: {
                        type: 'string',
                        pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$'
                    }
                }
            };

            expect(validator({'key': '555-1212'}, blueprint)).toBe(true);
            expect(validator({'key': '(888)555-1212'}, blueprint)).toBe(true);
            expect(validator({'key': '(888)555-1212 ext. 532'}, blueprint)).toBe(false);
            expect(validator({'key': '(800)FLOWERS'}, blueprint)).toBe(false);
        });
    });

    describe('integer validation', () => {
        it('general type validation', () => {
            const blueprint = { definitions: { key: { type: 'integer' } } };
            expect(validator(numberObject, blueprint)).toBe(true);
            expect(validator({'key': -1}, blueprint)).toBe(true);
    
            expect(validator({'key': '42'}, blueprint)).toBe(false);
            expect(validator(stringObject, blueprint)).toBe(false);
            expect(validator(floatObject, blueprint)).toBe(false);
            expect(validator(objectObject, blueprint)).toBe(false);
            expect(validator(arrayObject, blueprint)).toBe(false);
            expect(validator(falseObject, blueprint)).toBe(false);
            expect(validator(trueObject, blueprint)).toBe(false);
            expect(validator(nullObject, blueprint)).toBe(false);
            expect(validator(undefinedObject, blueprint)).toBe(false);
        });

        it('has "multiple" defined', () => {
            const blueprint = { definitions: { key: { type: 'integer', 'multipleOf' : 10 } } };
            expect(validator({'key': 0}, blueprint)).toBe(true);
            expect(validator({'key': 10}, blueprint)).toBe(true);
            expect(validator({'key': 20}, blueprint)).toBe(true);
            expect(validator({'key': 23}, blueprint)).toBe(false);
        });

        it('has "minimum" defined', () => {
            const blueprint = { definitions: { key: { type: 'integer', minimum: 0 } } };
            expect(validator({'key': 0}, blueprint)).toBe(true);
            expect(validator({'key': 10}, blueprint)).toBe(true);
            expect(validator({'key': 99}, blueprint)).toBe(true);

            expect(validator({'key': -1}, blueprint)).toBe(false);
        });

        it('has "exclusiveMinimum" defined', () => {
            const blueprint = { definitions: { key: { type: 'integer', exclusiveMinimum: 0 } } };
            expect(validator({'key': 10}, blueprint)).toBe(true);
            expect(validator({'key': 99}, blueprint)).toBe(true);
            
            expect(validator({'key': 0}, blueprint)).toBe(false);
            expect(validator({'key': -1}, blueprint)).toBe(false);
        });

        it('has "maximum" defined', () => {
            const blueprint = { definitions: { key: { type: 'integer', maximum: 0 } } };
            expect(validator({'key': 0}, blueprint)).toBe(true);
            expect(validator({'key': -1}, blueprint)).toBe(true);

            expect(validator({'key': 10}, blueprint)).toBe(false);
            expect(validator({'key': 99}, blueprint)).toBe(false);
        });

        it('has "exclusiveMaximum" defined', () => {
            const blueprint = { definitions: { key: { type: 'integer', exclusiveMaximum: 0 } } };
            expect(validator({'key': -1}, blueprint)).toBe(true);

            expect(validator({'key': 0}, blueprint)).toBe(false);
            expect(validator({'key': 10}, blueprint)).toBe(false);
            expect(validator({'key': 99}, blueprint)).toBe(false); 
        });
    });

    describe('number validation', () => {
        it('general type validation', () => {
            const blueprint = { definitions: { key: { type: 'number' } } };
            expect(validator(numberObject, blueprint)).toBe(true);
            expect(validator({'key': -1}, blueprint)).toBe(true);
            expect(validator(floatObject, blueprint)).toBe(true);
            expect(validator({'key': 2.99792458e8})).toBe(true);
    
            expect(validator({'key': '42'}, blueprint)).toBe(false);
            expect(validator(stringObject, blueprint)).toBe(false);
            expect(validator(objectObject, blueprint)).toBe(false);
            expect(validator(arrayObject, blueprint)).toBe(false);
            expect(validator(falseObject, blueprint)).toBe(false);
            expect(validator(trueObject, blueprint)).toBe(false);
            expect(validator(nullObject, blueprint)).toBe(false);
            expect(validator(undefinedObject, blueprint)).toBe(false);
        });

        it('has "multiple" defined', () => {
            const blueprint = { definitions: { key: { type: 'number', 'multipleOf' : 10 } } };
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
    });
});