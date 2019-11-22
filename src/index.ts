type ArrayType = string[] | number[] | object[] | boolean[];

type SchemaType = {
    [key: string]: string | number | boolean | SchemaType | ArrayType | null;
};

type Validator = (value: string | number | ArrayType) => boolean;

type Definition = {
    type: string;
    [key: string]: string | string[] | number | Validator;
}

type Definitions = {
    [key: string]: Definition;
};

type BlueprintType = {
    title?: string;
    definitions: Definitions
};

function validatBoolean(value: boolean, blueprint: Definition): boolean {
    return typeof value === blueprint['type'];
}

function validateNumber(value: number, blueprint: Definition): boolean {
    if (typeof value !== 'number') return false;
    
    if (blueprint['type'] === 'integer' && (value % 1.0) !== 0) return false;

    if ('multipleOf' in blueprint) {
        const multiple = blueprint['multipleOf'] as number;
        if ((value % multiple) !== 0) return false;
    }

    if ('minimum' in blueprint) {
        if (value < blueprint['minimum']) return false;
    }

    if ('exclusiveMinimum' in blueprint) {
        if (value <= blueprint['exclusiveMinimum']) return false;
    }

    if ('maximum' in blueprint) {
        if (value > blueprint['maximum']) return false;
    }

    if ('exclusiveMaximum' in blueprint) {
        if (value >= blueprint['exclusiveMaximum']) return false;
    }

    if ('validator' in blueprint) {
        const validator = blueprint['validator'] as Validator;
        if(!validator(value)) return false;
    }

    return true;
}

function validateString(value: string, blueprint: Definition): boolean {
    if (typeof value !== 'string') return false;

    if ('enum' in blueprint) {
        const enums = blueprint['enum'] as string[];
        if (!enums.includes(value)) return false;
    }

    if ('const' in blueprint) {
        const constant = blueprint['const'] as string;
        if (value !== constant) return false;
    }

    if ('minLength' in blueprint) {
        const threshold = blueprint['minLength'] as number;
        if (value.length < threshold) return false;
    }

    if ('maxLength' in blueprint) {
        const threshold = blueprint['maxLength'] as number;
        if (value.length > threshold) return false;
    }

    if ('pattern' in blueprint) {
        const re = new RegExp(blueprint['pattern'] as string);
        if (!re.test(value)) return false;
    }

    // TODO: Format
    // -> date-time | date | time
    // -> email | idn-email
    // -> hostname | idn-hostname
    // -> ipv4 | ipv6
    // -> uri | uri-reference | iri | iri-reference
    // -> uri-template
    // -> json-pointer
    // -> relative-json-pointer
    // -> regex

    if ('validator' in blueprint) {
        const validator = blueprint['validator'] as Validator;
        if (!validator(value)) return false;
    }

    return true;
}

function validateSubPart(schema: SchemaType, blueprint: Definitions): boolean {
    const keys = Object.keys(schema);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key in blueprint) {
            if (blueprint[key]['type'] === 'string') {
                if (!validateString(schema[key] as string, blueprint[key])) return false;
            } else if (
                blueprint[key]['type'] === 'number' ||
                blueprint[key]['type'] === 'integer'
                ) {
                if (!validateNumber(schema[key] as number, blueprint[key])) return false;
            } else if (blueprint[key]['type'] === 'boolean') {
                if (!validatBoolean(schema[key] as boolean, blueprint[key])) return false;
            }
        }
    }
    return true;
}

function validate(
    schema: SchemaType,
    blueprint: boolean | BlueprintType = false
    ): boolean {
    if (typeof blueprint === 'boolean') return blueprint;

    if (typeof schema !== 'object') return false;

    return validateSubPart(schema, blueprint.definitions);
}

module.exports = validate;