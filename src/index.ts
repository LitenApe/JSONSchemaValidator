type ArrayType = string[] | number[] | object[] | boolean[];

type SchemaType = {
    [key: string]: string | number | boolean | SchemaType | ArrayType | null;
}

function validateSubPart(schema: SchemaType, blueprint: SchemaType): boolean {
    const keys = Object.keys(schema);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key in blueprint) {
            console.log(schema[key], blueprint[key]);
        }
    }
    return true;
}

function validate(schema: SchemaType, blueprint: boolean | SchemaType = {}): boolean {
    if (typeof blueprint === 'boolean') {
        return blueprint;
    }

    if (typeof schema !== 'object') {
        return false;
    }

    return validateSubPart(schema, blueprint);
}

module.exports = validate;