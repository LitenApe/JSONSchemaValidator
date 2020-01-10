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

describe('general validation', () => {
    it('blueprint set as "false" always returns false', () => {
        expect(validator(arrayObject, false)).toBe(false);
        expect(validator(emptyObject, false)).toBe(false);
        expect(validator(falseObject, false)).toBe(false);
        expect(validator(floatObject, false)).toBe(false);
        expect(validator(nullObject, false)).toBe(false);
        expect(validator(numberObject, false)).toBe(false);
        expect(validator(objectObject, false)).toBe(false);
        expect(validator(stringObject, false)).toBe(false);
        expect(validator(trueObject, false)).toBe(false);
        expect(validator(undefinedObject, false)).toBe(false);
    });

    it('blueprint set as "true" always returns false', () => {
        expect(validator(arrayObject, true)).toBe(true);
        expect(validator(emptyObject, true)).toBe(true);
        expect(validator(falseObject, true)).toBe(true);
        expect(validator(floatObject, false)).toBe(false);
        expect(validator(nullObject, true)).toBe(true);
        expect(validator(numberObject, true)).toBe(true);
        expect(validator(objectObject, true)).toBe(true);
        expect(validator(stringObject, true)).toBe(true);
        expect(validator(trueObject, true)).toBe(true);
        expect(validator(undefinedObject, true)).toBe(true);
    });
});
