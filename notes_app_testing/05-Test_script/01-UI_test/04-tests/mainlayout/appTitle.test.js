import { test, expect } from "@playwright/test";
import { IndexPage} from "../../01-POM/index/indexpage.js";

test("TC_UI_01: Notes app title visible on browser tab", async ({page}) => {
    const indexPage = new IndexPage(page);
    await indexPage.goto();

    await expect(page).toHaveTitle("Notes App");
});