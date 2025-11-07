import { createData } from "../../data/helpers/createSignup_helper.js";

/**
 * Wrapper function for creating user data that returns an object without the "confirm_password" property.
 * 
 * @param {Object} overrides - An object is used to override default/base user data.
 * @param {string | number } testID - ID of the test, used for creating sign-up data in UI tests. Not used in DB tests.
 * @param {Object} options - Options object indicating test type. In this context, `testUI` is always false.
 * @returns {Object} - A user data object suitable for creating a user document, without the "confirm_password" property.
 * 
 * @example
 * createDataDB({}, "noID", {testUI: false})
 */
export function createDataDB(overrides = {}, testID = "noID", options = {testUI: true}) {
    let dataCloned = createData(overrides, testID, options);
    delete dataCloned["confirm_password"];

    return dataCloned;
}