const validator = require('../index');

const arrayObject = {'key': []};
const emptyObject = {};
const emptyRecursiveObject = {'key': {'key': {}}}
const falseObject = {'key': false};
const floatObject = {'key': 3.14};
const nullObject = {'key': null};
const numberObject = {'key': 42};
const objectObject = {'key': {}};
const stringObject = {'key': 'This is a string'};
const trueObject = {'key': true};
const undefinedObject = {'key': undefined};

describe('string validation', () => {
    it('general type validation', () => {
        const blueprint = { definitions: { key: { type: 'string' } } };
        expect(validator({'key': ''}, blueprint)).toBe(true);
        expect(validator({'key': '42'}, blueprint)).toBe(true);
        expect(validator({'key': 'Déjà vu'}, blueprint)).toBe(true);
        expect(validator(stringObject, blueprint)).toBe(true);

        expect(validator(arrayObject, blueprint)).toBe(false);
        expect(validator(falseObject, blueprint)).toBe(false);
        expect(validator(floatObject, blueprint)).toBe(false);
        expect(validator(nullObject, blueprint)).toBe(false);
        expect(validator(numberObject, blueprint)).toBe(false);
        expect(validator(objectObject, blueprint)).toBe(false);
        expect(validator(trueObject, blueprint)).toBe(false);
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
});
