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

function validateString(value: string, blueprint: Definition): boolean {
    if (blueprint.type !== 'string') return false;

    if (blueprint['validator']) {
        const validator = blueprint['validator'] as Validator
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

    // TODO: Regex

    // TODO: Format

    return true;
}

function validateSubPart(schema: SchemaType, blueprint: Definitions): boolean {
    const keys = Object.keys(schema);

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key in blueprint) {
            if (typeof schema[key] === 'string') {
                if (!validateString(schema[key] as string, blueprint[key])) return false;
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