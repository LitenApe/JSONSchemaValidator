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

describe('boolean validation', () => {
    it('general type validation', () => {
        const blueprint = { definitions: { key: { type: 'boolean' } } };
        expect(validator(falseObject, blueprint)).toBe(true);
        expect(validator(trueObject, blueprint)).toBe(true);
        
        expect(validator(floatObject, blueprint)).toBe(false);
        expect(validator(numberObject, blueprint)).toBe(false);
        expect(validator(stringObject, blueprint)).toBe(false);
        expect(validator(objectObject, blueprint)).toBe(false);
        expect(validator(arrayObject, blueprint)).toBe(false);
        expect(validator(nullObject, blueprint)).toBe(false);
        expect(validator(undefinedObject, blueprint)).toBe(false);
    });
});