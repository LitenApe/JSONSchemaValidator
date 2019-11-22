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

describe('null validation', () => {
    it('general type validation', () => {
        const blueprint = { definitions: { key: { type: 'null' } } };
        expect(validator(nullObject, blueprint)).toBe(true);
        
        expect(validator(falseObject, blueprint)).toBe(false);
        expect(validator(trueObject, blueprint)).toBe(false);
        expect(validator(floatObject, blueprint)).toBe(false);
        expect(validator(numberObject, blueprint)).toBe(false);
        expect(validator(stringObject, blueprint)).toBe(false);
        expect(validator(objectObject, blueprint)).toBe(false);
        expect(validator(arrayObject, blueprint)).toBe(false);
        expect(validator(undefinedObject, blueprint)).toBe(false);
    });
});