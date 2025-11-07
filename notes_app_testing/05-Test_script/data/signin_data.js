import { makeTestCase } from "./helpers/testCase_helper.js";
import { createData } from "./helpers/createSignIn_helper.js";

const makeSignInCase = makeTestCase(createData);

export const signInData = {
    valid: [ makeSignInCase({ name: "TC_UI_16.01: Sign-in succeeds"})],
    missingFields: [
        makeSignInCase({ name: "TC_UI_16.02: Sign-in fails - all fields empty", agrs: [{email: "", password: ""}]}),
        makeSignInCase({ name: "TC_UI_16.03: Sign-in fails - empty email, password filled", agrs: [{email: ""}]}),
        makeSignInCase({ name: "TC_UI_16.04: Sign-in fails - correct email, empty password", agrs: [{password: ""}]}),
    ],
    incorrectPassword: [
        makeSignInCase({ name: "TC_UI_16.05: Sign-in fails - correct email, incorrect password", agrs: [{password: "user1"}]}),
    ],
    incorrectEmail: [
        makeSignInCase({ name: "TC_UI_16.06: Sign-in fails -  incorrect email, password filled", agrs: [{email: "user@gmail.com"}]}),
    ]
}

// for(const key in signInData) {
// console.log(JSON.stringify(signInData[key]));
// }