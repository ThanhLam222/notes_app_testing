"use strict";

import {test, expect} from "../../02-fixtures/authorized_fixture.js";
import { EditNotePage } from "../../01-POM/note/editnotepage.js";
import { MainLayout } from "../../01-POM/mainlayout.js";

test("Check authorization", async ({createNote, loginToCheckAuthorization, page}) => {
    const {page : pageB} = loginToCheckAuthorization;
    const userBLayout = new MainLayout(pageB);
    const editNotePage = new EditNotePage(pageB);
    const noteID1 = createNote.notes.note1.id;

    await editNotePage.goto(noteID1);
    await expect(pageB).toHaveURL('/notes');
    await expect(await userBLayout.countMessage()).toEqual(1);
    await expect (userBLayout.resultPopUp).toHaveText("Not Authorized");
    await userBLayout.clickCloseButton("Not Authorized");

})