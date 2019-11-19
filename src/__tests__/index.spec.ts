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

    it('empty nested object returns true', () => {
        expect(validator(emptyRecursiveObject, emptyRecursiveObject)).toBe(true);
    });
});