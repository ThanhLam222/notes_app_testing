"use strict";

import {test, expect} from "../../02-fixtures/login_fixture.js";

test('Login fixture', async ({login, page}) => {
    expect(page).toHaveURL('/notes');
});