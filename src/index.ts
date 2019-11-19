type Array = string[] | number[] | object[] | boolean[];

type Schema = {
    [key: string]: string | number | boolean | Schema | Array | null;
};

function validateSubPart(schema: Schema, blueprint: Schema): boolean {
    const keys = Object.keys(schema);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key in blueprint) {
            console.log(schema[key], blueprint[key]);
        }
    }
    return true;
}

function validate(schema: Schema, blueprint: Boolean | Schema = {}): boolean {
    if (typeof blueprint === 'boolean') {
        return blueprint;
    }

    if (typeof schema !== 'object') {
        return false;
    }

    return validateSubPart(schema, blueprint);
}

export default validate;