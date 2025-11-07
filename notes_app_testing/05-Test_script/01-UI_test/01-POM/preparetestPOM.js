import { chromium } from 'playwright';
import { NewNotePage } from "./note/newnotepage.js";
import { EditNotePage } from "./note/editnotepage.js";
import { AllNotesPage } from "./note/allnotespage.js";
import { IndexPage } from "./index/indexpage.js";
import { AboutPage } from "./index/aboutpage.js";
import { SignInPage} from "./auth/signinpage.js";
import { SignUpPage} from "./auth/signuppage.js";

//create instance of apps
export async function createInstance() {
    const browser = await chromium.launch({ headless: false, slowMo: 2000 }); // , slowMo: 3000
    const page = await browser.newPage();
    
    const signUpPage = new SignUpPage(page);
    const signInPage = new SignInPage(page);
    const aboutPage = new AboutPage(page);
    const indexPage = new IndexPage(page);
    const newNotePage = new NewNotePage(page);
    const editNotePage = new EditNotePage(page);
    const allNotesPage = new AllNotesPage(page);

    return {
        page,
        browser,
        signUpPage,
        signInPage,
        aboutPage,
        indexPage,
        newNotePage,
        editNotePage,
        allNotesPage,
    }
}

// const pagePlaywright = await createInstance().page;
// Print text content of button to console
export function printTextContent(buttonTexts) {
    
    for (const text of buttonTexts ) {
        console.log(text ?? 'No text found');
    }
}

// navigation elements for all users
export async function navAllUsers(page) {
    const notesApp = await page.navRootPageLink.textContent();
    const about = await page.navAboutLink.textContent();
    const allButtonsTexts = [notesApp, about];

    printTextContent(allButtonsTexts);
}


// navigation elements for user who not logged-in
export async function navNonLoggedIn(page) {
    const login = await page.navLoginLink.textContent();
    const register = await page.navRegisterLink.textContent();
    const allButtonsTexts = [login, register];

    printTextContent(allButtonsTexts);
    
}

// navigation elements for user who logged-in
export async function navLoggedIn(page) {
    const dropdownMenu = await page.dropdownMenu.textContent();
    const allDropdownItems = await page.allDropdownItems.allTextContents();
    await page.openDropdownMenu();

    const eachItem = async (nameLink) => {
            return await page.getDropdownItem(nameLink).textContent();
    }
    const names = ['All Notes', 'Add A Note', 'Logout'];
    const textItems = await Promise.all(names.map(name => eachItem(name)));
    const allButtonsTexts = [dropdownMenu, ...allDropdownItems, ...textItems];

    printTextContent(allButtonsTexts);
}

// Flash/Error message when a message is displayed
export async function message(page) {
    const textMessages = await page.resultPopUp.allTextContents();
    printTextContent(textMessages);

    for(const text of textMessages) {
        const button = await page.getCloseButtonByMessage(text).textContent();
        console.log(button ?? 'No text found');
    }

}

// Clicks buttons
// Go back to the previous page
export async function backToPage(page, url) {
    await page.goto(url);
    // await page.waitForURL(`^${url}`);
}

export async function clickButtonAllUsers(page, url) {
    await page.clickNavRootPage();
    await backToPage(page, url);

    await page.clickNavAbout();
    await backToPage(page, url);
}

export async function clickButtonNonLoggedIn(page, url) {
    await page.clickNavLogin();
    await backToPage(page, url);

    await page.clickNavRegister();
    await backToPage(page, url);
}

export async function clickButtonLoggedIn(page, url) {
    const names = ['All Notes', 'Add A Note', 'Logout'];

    for(const name of names) {

        if(name === 'Logout') {
            break;
        }
        await page.clickDropdownItem(name);



        await backToPage(page, url);
    }
}

export async function clickCloseButton(page) {
    
    const textMessages = await page.resultPopUp.allTextContents();

   if(!textMessages.length) {
            console.log('Dont have element');
            return;
        }

    for(const text of textMessages) {
        
        await page.clickCloseButton(text);
    }
}

// Individual page
// Text content

export async function pageLocators(page) {
    const title = await page.pageTitle.textContent();
    const textAllFields = await page.allFields.allTextContents();


    const allButtonsTexts = [title, ...textAllFields];
    printTextContent(allButtonsTexts);
}

export async function saveButtonText(page){

    const text = await page.saveButton.textContent();
    console.log(text);
}

export async function signInButtonText(page) {

    const text = await page.signInButton.textContent();
    console.log(text);
}

export async function signUpButtonText(page) {

    const text = await page.signUpButton.textContent();
    console.log(text);
}

export async function signUpDirection(page) {
    const text = await page.registerDirection.textContent();
    const link = await page.formRegisterLink.textContent();
    
    printTextContent([text, link]);
}

export async function signInDirection(page) {
    const text = await page.loginDirection.textContent();
    const link = await page.formLoginLink.textContent();
    printTextContent([text, link]);
}

export async function getLabelText(page, key) {

        const label = await page.getLabel(key).textContent();
        console.log(label);
}


// Performs action

export async function clickSignIn(page) {
    await page.clickSignInButton();
}

export async function clickSignUp(page) {
    await page.clickSignUpButton();
}

export async function clickSave(page) {
    await page.clickSaveButton();
}

export async function fillAllForm(page, data) {
    await page.fillForm(data);
}

export async function getValueContent(page, data) {
    for(const key in data) {
        const value = await page.getFieldValue(key);
        console.log(value);
    }
}
    