export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const pluralizedEndings = {
    ves: 'fe',
    ies: 'y',
    i: 'us',
    zes: 'ze',
    ses: 's',
    es: 'e',
    s: '',
};

export function singularize(word: string) {
    for (const [plural, singular] of Object.entries(pluralizedEndings)) {
        if (word.endsWith(plural)) {
            return word.slice(0, -plural.length) + singular;
        }
    }

    return word;
}

export function camelCaseToSnakeCase(string: string) {
    return string.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function camelCaseToKebabCase(string: string) {
    return string.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function resourceNameToTranslateKey(resourceName: string) {
    const singularResource = singularize(resourceName);
    return camelCaseToSnakeCase(singularResource);
}
