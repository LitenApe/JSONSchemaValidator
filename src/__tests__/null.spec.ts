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

describe('null validation', () => {
    it('general type validation', () => {
        const blueprint = { definitions: { key: { type: 'null' } } };
        expect(validator(nullObject, blueprint)).toBe(true);
        
        expect(validator(arrayObject, blueprint)).toBe(false);
        expect(validator(falseObject, blueprint)).toBe(false);
        expect(validator(floatObject, blueprint)).toBe(false);
        expect(validator(numberObject, blueprint)).toBe(false);
        expect(validator(objectObject, blueprint)).toBe(false);
        expect(validator(stringObject, blueprint)).toBe(false);
        expect(validator(trueObject, blueprint)).toBe(false);
        expect(validator(undefinedObject, blueprint)).toBe(false);
    });
});
