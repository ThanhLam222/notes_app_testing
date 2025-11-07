import { makeTestCase } from "./helpers/testCase_helper.js";
import { createData } from "./helpers/createSignIn_helper.js";

const makeSignInCase = makeTestCase(createData);

export const signInData = {
    valid: makeSignInCase(),
    missingEmail: makeSignInCase({agrs: [{email: ""}]}),
    missingPassword: makeSignInCase({agrs: [{password: ""}]}),
    incorrectEmail: makeSignInCase({agrs: [{email: "user@gmail.com"}]}),
    incorrectPassword: makeSignInCase({agrs: [{password: "user1"}]}),
}

// for(const key in signInData) {
//     console.log(JSON.stringify(signInData[key]));
// }