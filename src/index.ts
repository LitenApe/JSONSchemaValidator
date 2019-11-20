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

function validateNumber(value: number, blueprint: Definition): boolean {
    if (['integer', 'number'].includes(blueprint['type'])) return false;

    if (blueprint['validator']) {
        const validator = blueprint['validator'] as Validator;
        if(!validator(value)) return false;
    }

    return true;
}

function validateString(value: string, blueprint: Definition): boolean {
    if (typeof value !== 'string') return false;

    if (blueprint['validator']) {
        const validator = blueprint['validator'] as Validator;
        if (!validator(value)) return false;
    }

    if (blueprint['enum']) {
        const enums = blueprint['enum'] as string[];
        if (!enums.includes(value)) return false;
    }

    if (blueprint['const']) {
        const constant = blueprint['const'] as string;
        if (value !== constant) return false;
    }

    if (blueprint['minLength']) {
        const threshold = blueprint['minLength'] as number;
        if (value.length < threshold) return false;
    }

    if (blueprint['maxLength']) {
        const threshold = blueprint['maxLength'] as number;
        if (value.length > threshold) return false;
    }

    if (blueprint['pattern']) {
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

    return true;
}

function validateSubPart(schema: SchemaType, blueprint: Definitions): boolean {
    const keys = Object.keys(schema);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key in blueprint) {
            if (blueprint[key]['type'] === 'string') {
                if (!validateString(schema[key] as string, blueprint[key])) return false;
            } else if (blueprint[key]['type'] === 'number') {
                if (!validateNumber(schema[key] as number, blueprint[key])) return false;
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