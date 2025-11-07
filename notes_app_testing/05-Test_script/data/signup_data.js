import { makeTestCase } from "./helpers/testCase_helper.js";
import { createData } from "./helpers/createSignup_helper.js";

const makeSignUpCase = makeTestCase(createData);

export const signUpData = {
    valid: [
        makeSignUpCase({
            name: "TC_UI_12.01: Sign up succeeds - All valid required fields - password = 4 characters and empty optional name",
            agrs: [{name: "", password: "user", "confirm password": "user"}, 1],
        }),
        makeSignUpCase({
            name: "TC_UI_12.02: Sign up succeeds  - All valid required fields - password = 5 characters and empty optional name",
            agrs: [{name: ""}, 2],
        }),
        makeSignUpCase({
            name: "TC_UI_12.03: Sign up succeeds  - All valid required fields - optional name filled",
            agrs: [{}, 3],
        })
    ],
    missingFields: [
        makeSignUpCase({ 
            name: "TC_UI_12.04: Sign up fails - all fields empty",
            agrs: [{name: "", email: "", password: "", "confirm password": ""}, 4],
        }),
        makeSignUpCase({
            name: "TC_UI_12.05: Sign up fails - empty email, short password, mismatch confirm, non-empty name",
            agrs: [{email: "", password: "use"}, 5],
        }),
        makeSignUpCase({
            name: "TC_UI_12.06: Sign up fails - empty email,valid password, confirm matches, empty name",
            agrs: [{name: "", email: ""}, 6],
        }),
        makeSignUpCase({
            name: "TC_UI_12.07: Sign up fails - existing email, empty password, confirm filled, name not empty",
            agrs: [{email: "admin@localhost", password: ""}, 7],
        }),
        makeSignUpCase({
            name: "TC_UI_12.09: Sign up fails - existing email, valid password, empty confirm, name not empty",
            agrs: [{email: "admin@localhost", "confirm password": ""}, 9],
        }),
        makeSignUpCase({
            name: "TC_UI_12.11: Sign up fails - valid email, empty password, confirm filled, empty name",
            agrs: [{name: "", password: ""}, 11],
        }),
        makeSignUpCase({
            name: "TC_UI_12.12: Sign up fails - valid email, short password, empty confirm, name not empty",
            agrs: [{password: "use", "confirm password": ""}, 12],
        }),
    ],
    existingEmail: [
        makeSignUpCase({
            name: "TC_UI_12.08: Sign up fails - existing email, short password, confirm matches, empty name",
            agrs: [{name: "", email: "admin@localhost", password: "use", "confirm password": "use"}, 8],
        }),
        makeSignUpCase({
            name: "TC_UI_12.10: Sign up fails -  existing email, valid password, confirm matches, name not empty",
            agrs: [{email: "admin@localhost"}, 10],
        }),
    ],
    shortPassword: [
        makeSignUpCase({ 
            name: "TC_UI_12.13: Sign up fails - valid email, short password, confirm matches, empty name",
            agrs: [{name: "", password: "use", "confirm password": "use"}, 13],
        }),
    ],
    mismatchPassword: [
        makeSignUpCase({
            name: " TC_UI_12.14: Sign up fails - valid email, valid password, confirm mismatch, name not empty",
            agrs: [{"confirm password": "user"}, 14],
        }),
    ],
    invalidEmail: [
        makeSignUpCase({
            name: "TC_UI_12.15: Sign up fails - invalid email, empty password, confirm filled, name not empty",
            agrs: [{email: "user.com", password: ""}, 15],
        }),
        makeSignUpCase({
            name: "TC_UI_12.16: Sign up fails - invalid email, short password, empty confirm, empty name",
            agrs: [{name: "", email: "user.com", password: "use", "confirm password": ""}, 16],
        }),
        makeSignUpCase({
            name: "TC_UI_12.17: Sign up fails - invalid email, valid password, confirm mismatch, name not empty",
            agrs: [{ email: "user.com", "confirm password": "user"}, 17],
        }),
        makeSignUpCase({
            name: "TC_UI_12.18: Sign up fails - invalid email, valid password, confirm matches, name not empty",
            agrs: [{ email: "user.com"}, 18],           
        })
    ],
    bothPasswordErrors: [
        makeSignUpCase({
            name: "TC_UI_12.19: Sign up fails - valid email, short password, confirm mismatch, name not empty",
            agrs: [{password: "use"}, 19],
        }),
    ]
}

// for(const key in signUpData.bothPasswordErrors) {
// console.log(JSON.stringify(signUpData.bothPasswordErrors[key]));
// }