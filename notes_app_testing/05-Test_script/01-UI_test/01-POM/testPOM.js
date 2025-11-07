import {createInstance, printTextContent, navAllUsers, navNonLoggedIn, navLoggedIn, message, backToPage, clickButtonAllUsers, clickButtonNonLoggedIn,
    clickButtonLoggedIn, clickCloseButton, pageLocators, saveButtonText, signInButtonText, signUpButtonText, signUpDirection, signInDirection,
    getLabelText, clickSignIn, clickSignUp, clickSave, fillAllForm, getValueContent 
} from './preparetestPOM.js';

const instance = await createInstance();

const authRoute = {
    signInPage: "http://localhost:4000/auth/signin",
    signUpPage: "http://localhost:4000/auth/signup",
}

const indexRoute = {
    indexPage: "http://localhost:4000/",
    aboutPage: "http://localhost:4000/about"
}

const noteRoute = {
    newNotePage: "http://localhost:4000/notes/add",
    editNotePage: "http://localhost:4000/notes/edit/",
    allNotesPage: "http://localhost:4000/notes",
}

const noteData = {
    title: "Note test",
    description: "Test locator Ok",
}

const signInData = {
    email: "admin@localhost",
    password: "adminpassword",
}

const signUpData =  {
    name: "user",
    email: "user1@gmail.com",
    password: "userpassword",
    "confirm password": "userpassword",
}

// Checks public routes

 async function checkNavPublicRoute() {
    const publicRoute = Object.assign({}, authRoute, indexRoute);

    for(const key in publicRoute) {
        const page = instance[key];
        const url = publicRoute[key];
        console.log(url);

        await page.goto();

        await navAllUsers(page);
        await navNonLoggedIn(page);
        await clickButtonAllUsers(page, url);
        await clickButtonNonLoggedIn(page, url);
    }

}

 async function checkAuthRouteForm() {
    for(const key in authRoute) {
        const page = instance[key];
        const url = authRoute[key];
        console.log(url);

        await page.goto();
        await pageLocators(page);


        if(key == "signInPage") {
            await signInButtonText(page);
            await signUpDirection(page);

            for(const label in signInData) {
                await getLabelText(page, label);
            }
 
            await fillAllForm(page, signInData);
            await getValueContent(page, signInData);
            await clickSignIn(page);
        }
        else {
            await signUpButtonText(page);
            await signInDirection(page);

            for(const label in signUpData) {
                await getLabelText(page, label);
            }

            await fillAllForm(page, signUpData);
            await getValueContent(page, signUpData);
            await clickSignUp(page);
        }

    }
}

 async function checkIndexRoute() {
    for( const key in indexRoute) {

        const page = instance[key];
        const url = indexRoute[key];
        console.log(url);

        await page.goto();
        const title = await page.pageTitle.textContent();
        console.log(title);
        if(key == 'aboutPage') {
            console.log(await page.pageParagraph.textContent());
        }
        else {
            console.log(await page.appPurpose.textContent());
            console.log(await page.registerButton.textContent());
            await page.clickRegisterButton();
        }

    }

}

// Checks protected routes

async function logIn() {
    const page = instance.signInPage;
    const url = authRoute.signInPage;

    await page.goto();
    await fillAllForm(page, signInData);
    await clickSignIn(page);

}

 async function checkNotesPages() {
    await logIn();

    // Checks All notes page when no notes
    let page = instance.allNotesPage;
    let url = noteRoute.allNotesPage;
    console.log(await page.greetingText.textContent());
    console.log(await page.noNoteNotice.textContent());
    console.log(await page.createNoteButton.textContent());

    await page.clickCreateNoteButton();

    // Checks New note pages
    page = instance.newNotePage;
    await pageLocators(page);
    for(const label in noteData) {
        await getLabelText(page, label);
    }
    await fillAllForm(page, noteData);
    await getValueContent(page, noteData);
    await saveButtonText(page);
    await clickSave(page);

    // Checks All notes page has notes
    page = instance.allNotesPage;

    const notes = await page.allNotes.allTextContents();
 
    
    const noteTitle = await page.getNoteTitle(1).textContent();
    const noteDes = await page.getNoteDescription(1).textContent();
    const noteEdit = await page.getEditIcon(1).textContent();
    const noteDelete = await page.getDeleteButton(1).textContent();
    printTextContent([...notes, noteTitle, noteDes, noteEdit, noteDelete]);
    
    await page.clickEditIcon(0);


    // Check Edit note page
    page = instance.editNotePage;
    await pageLocators(page);

    for(const label in noteData) {
        await getLabelText(page, label);
    }

    await fillAllForm(page, noteData);
    await getValueContent(page, noteData);
    await saveButtonText(page);
    await clickSave(page);

    page = instance.allNotesPage;

    await page.clickDeleteButton(0);

    await page.clickDropdownItem('Logout');

}

async function checkNavProtectedRoute() {

    await logIn();

    for(const key in noteRoute) {
        if(key == "editNotePage") { continue;}
        const page = instance[key];
        const url = noteRoute[key];
        

        await page.goto(url);

        await navAllUsers(page);
        await navLoggedIn(page);
        await clickButtonAllUsers(page, url);
        await clickButtonLoggedIn(page, url);
    }

}

async function checkMessage() {
    const page = instance.signInPage;
    const url = authRoute.signInPage;

    await page.goto();
    await clickSignIn(page);

    await message(page);
    await clickCloseButton(page);

}

(async () => {
    // await checkNavPublicRoute();
    // await checkAuthRouteForm();
    // await checkIndexRoute();
    await checkNotesPages();
    // await checkNavProtectedRoute();
    // await checkMessage();
    await instance.browser.close();
})();

