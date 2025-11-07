import { makeTestCase } from "./helpers/testCase_helper.js";
import { createDataDB } from "../03-DB_test/01-helpers/wrapperCreateSignup.js";

const makeSignUpCase = makeTestCase(createDataDB);

export const userData = {
    validHasName: makeSignUpCase({agrs: [{}, "noID", { testUI: false}]}),
    validNoName: makeSignUpCase({agrs: [{name: ""}, "noID", { testUI: false}]}),
    validHaveSpaces: makeSignUpCase({agrs: [{name: " user ", email: " userfixed@gmail.com "}, "noID", { testUI: false}]}),
    missingEmail: makeSignUpCase({agrs: [{email: ""}, "noID", { testUI: false}]}),
    missingPassword: makeSignUpCase({agrs: [{password: ""}, "noID", { testUI: false}]}),
    existingEmail: makeSignUpCase({agrs: [{email: "admin@localhost"}, "noID", { testUI: false}]}),
    shortPassword: makeSignUpCase({agrs: [{password: "use"}, "noID", { testUI: false}]}),
    invalidEmail: makeSignUpCase({agrs: [{email: "use.com"}, "noID", { testUI: false}]}),
}

// for(const key of Object.keys(signUpData)) {
//     console.log(JSON.stringify(signUpData[key]));
// }