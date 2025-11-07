import { makeTestCase } from "./helpers/testCase_helper.js";
import { createData } from "./helpers/createSignup_helper.js";

const makeSignUpCase = makeTestCase(createData);

export const signUpData = {
    valid: makeSignUpCase({ agrs: [{}, "noID", { testUI: false}]}),
    missingEmail: makeSignUpCase({agrs: [{email: ""}, "noID", {testUI: false}]}),
    missingPassword: makeSignUpCase({agrs: [{password: ""}, "noID", {testUI: false}]}),
    missingConfirmPassword: makeSignUpCase({agrs: [{"confirm password": ""}, "noID", {testUI: false}]}),
    emailExisting: makeSignUpCase({agrs: [{email: "admin@localhost"}, "noID", {testUI: false}]}),
    shortPassword: makeSignUpCase({agrs: [{password: "use", "confirm password": "use"}, "noID", {testUI: false}]}),
    mismatchPassword: makeSignUpCase({agrs: [{"confirm password": "user"}, "noID", {testUI: false}]}),
    invalidEmail: makeSignUpCase({agrs: [{email: "user.com"}, "noID", {testUI: false}]})
}

// for(const key in signUpData) {
//     console.log(JSON.stringify(signUpData[key]));
// }