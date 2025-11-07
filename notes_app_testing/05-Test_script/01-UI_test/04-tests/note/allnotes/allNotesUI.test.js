import { test, expect } from "../../../02-fixtures/createNote_fixture.js";
import { AllNotesPage } from "../../../01-POM/note/allnotespage.js";
import { EditNotePage } from "../../../01-POM/note/editnotepage.js";
import { NewNotePage } from "../../../01-POM/note/newnotepage.js";
import { verifyNoteContent } from "../../../03-helpers/noteContentHelper.js";
import { verifyAllNotesPageLoaded } from "../../../03-helpers/allNotesPageLoadedHelper.js";

test.describe("Verification All Notes page UI - logged in user", () => {
    test.describe("All Notes page - has notes", () => {
        let allNotesPage, notes, countExistingNotes, count;

        test.beforeEach(async ({ createNote }) => {
            ({ allNotesPage, notes, countExistingNotes, count } = createNote);
        });

        test("TC_UI_20.01: All notes elements displayed correctly - has notes", async () => {
                
            await test.step("Check all notes has been created are displayed", async () => {
                await verifyNoteContent(allNotesPage, notes, countExistingNotes);
            });

            await test.step("Check 'Edit' icon and 'Delete' button visible for each note", async () => { 
                for(let i = 0; i < countExistingNotes + count; ++i) {
                    await expect.soft(allNotesPage.getEditIcon(i)).toBeVisible();
                    await expect.soft(allNotesPage.getDeleteButton(i)).toBeVisible();
                }
            });

            await test.step("Check note displayed by date descending", async () => {
                /**
                 * Since the notes list is inserted by date in ascending order,
                 * while the All Notes page sorts notes in descending order,
                 * Therefore, uiIndex decreases with each iteration
                 * to ensure that the first created note appears last.
                 */

                let uiIndex = count - 1;

                for(const key of Object.keys(notes)) {
                    const title = (await allNotesPage.getNoteTitle(uiIndex).innerText()).toLowerCase();
                    const description = (await allNotesPage.getNoteDescription(uiIndex).innerText()).toLowerCase();

                    expect(notes[key].title.toLowerCase()).toEqual(title);
                    expect(notes[key].description.toLowerCase()).toEqual(description);
                    uiIndex -= 1;
                }
            });
        });

        test("TC_UI_20.02: 'Edit' icon redirects to Edit Note page", async ({page}) => {
            const editNotePage = new EditNotePage(page);

            for(let i = 0; i < countExistingNotes + count; ++i) {
                const title = (await allNotesPage.getNoteTitle(i).innerText()).toLowerCase();
                const description = (await allNotesPage.getNoteDescription(i).innerText()).toLowerCase();

                await allNotesPage.clickEditIcon(i);

                await test.step("Check redirected to correct URL", async () => {
                    await expect(page).toHaveURL(/\/notes\/edit\/\d+/);
                    await expect(editNotePage.pageTitle).toBeVisible();
                });

                await test.step("Check title and description displayed correctly", async () => { 
                    expect(title).toEqual((await editNotePage.getFieldValue("title")).toLowerCase());
                    expect(description).toEqual((await editNotePage.getFieldValue("description")).toLowerCase());
                });

                await allNotesPage.goto();
                await verifyAllNotesPageLoaded(allNotesPage);
            }
        });

        test("TC_UI_20.03:  'Delete' button delete note", async ({page}) => {
            let countAllNotes = countExistingNotes + count;

            for(let remaining = countExistingNotes + count; remaining > 0; --remaining) {
                const title = (await allNotesPage.getNoteTitle(0).innerText()).toLowerCase();
                const description = (await allNotesPage.getNoteDescription(0).innerText()).toLowerCase();

                await allNotesPage.clickDeleteButton(0);

                await test.step("Check redirected to correct URL", async () => {
                    await expect(page).toHaveURL("/notes");
                    await verifyAllNotesPageLoaded(allNotesPage);
                });

                await test.step("Check notes deleted correctly", async () => { 
                    await verifyNoteContent(allNotesPage, {data: {title, description}}, remaining, {deleteNote: true});
                });

                await allNotesPage.goto();
                await verifyAllNotesPageLoaded(allNotesPage);
            }
        });
    });

    test.describe("All Notes page - no notes", () => {
        let allNotesPage;

        test.beforeEach(async ({ login, page }) => {
            allNotesPage = new AllNotesPage(page);
            const countExistingNotes = await allNotesPage.allNotes.count();
            if (countExistingNotes > 0) {
                await allNotesPage.removeAll();
            }
            await expect(allNotesPage.allNotes).toHaveCount(0);
        });

        test("TC_UI_21.01: All notes elements displayed correctly - no notes", async () => {
            await test.step("Check greeting text", async () => {
                const greeting = allNotesPage.greetingText;

                await expect.soft(greeting).toBeVisible();
                await expect.soft(greeting).toHaveText("Hello admin");
            });

            await test.step("Check no note notice", async () => {
                const noNoteNotice = allNotesPage.noNoteNotice;
                
                await expect.soft(noNoteNotice).toBeVisible();
            });

            await test.step("Check 'Create One!'link", async () => {
                await expect.soft(allNotesPage.createNoteButton).toBeVisible();
            })
        });

        test("TC_UI_21.02: the 'Create One!' link redirects correctly", async ({ page }) => {
            await allNotesPage.clickCreateNoteButton();
            await expect(page).toHaveURL("/notes/add");
            const newNotePage = new NewNotePage(page);
            await expect(newNotePage.pageTitle).toBeVisible();
        });
    });
});