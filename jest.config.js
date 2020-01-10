module.exports = {
    preset: 'ts-jest',
    roots: ["./src"],
    testMatch: ["**/?(*.)+(spec|test).+(ts|tsx|js)"],
    transform: {
        "^.+/.ts?$": "ts-jest"
    }
}