
const invalidatedTokens = [];

const addToBlacklist = (token) => {
    invalidatedTokens.push(token);
};

const removeFromBlacklist = (token) => {
    const index = invalidatedTokens.indexOf(token);
    if (index !== -1) {
        invalidatedTokens.splice(index, 1);
    }
};

const isTokenBlacklisted = (token) => {
    return invalidatedTokens.includes(token);
};

module.exports = {
    invalidatedTokens,
    addToBlacklist,
    removeFromBlacklist,
    isTokenBlacklisted,
};
