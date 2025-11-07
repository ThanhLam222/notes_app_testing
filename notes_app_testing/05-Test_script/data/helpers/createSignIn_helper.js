import { baseUser } from "../base_user.js";

export function createData(overrides = {}) {
    return {...baseUser.userA, ...overrides};
}