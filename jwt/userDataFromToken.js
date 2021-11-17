"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFromTokenData = void 0;
const userFromTokenData = (userClass, data) => {
    const user = new userClass();
    for (const [key, value] of Object.entries(data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user[key] = value;
    }
    return user;
};
exports.userFromTokenData = userFromTokenData;
