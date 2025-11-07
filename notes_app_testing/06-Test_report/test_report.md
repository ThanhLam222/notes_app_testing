# TEST REPORT

## 1. Test Objectives
* Verify that the core system functionalities operate as intended:
  * The UI renders correctly and supports expected user interactions.
  * The API returns valid responses and adheres to requirements.
  * Data is correctly persisted to and retrieved from the database.
## 2. Test Scope
**a. Automation test**

| Test type | Description                 |
|:---------:|:----------------------------|
| UI | main layout, Auth Module (Sign in, Sign up, Log out), Note Module (All Notes, New Note, Edit Note), Index Module ( Index page, About page), handling (404 Not Found page). |
| API | Auth route (5 route), Note route (6 route), Index route (2 route), Not Found error, 505 error. |
| Database | User Model, Note Model, sessions collection. |

**b. Manual test**
* Exploratory testing

## 3. Test Environment
* Browser: Chrome, Firefox
* MongoDB server: 8.0.15 in Docker to run app for UI testing, MongoDB Memory Server (10.2.3) for API and Database testing.
* Frameworks: Playwright (UI testing), Jest + Supertest (API + DB testing).
## 4. Test Approach
* UI: Page Object Model + Playwright test runner.
* API: Service Object Model + Jest runner + connect/disconnect/clear DB each test to have fresh DB in each test.
* Database: Jest runner + connect/disconnect/clear DB each test to have fresh DB in each test.
## 5. Test Results

| Test type | Total | Passed | Failed | Notes |
|:---------:|:-----:|:------:|:------:|:------|
| UI | 87 | 68 | 19 | See details in test case UI excel file. |
| API | 66 | 38 | 28 | See details in test case API excel file. |
| Database | 25 | 22 | 3 | See details in test case DB excel file. |
| Exploratory testing | 2 | 1 | 1 | See details in exploratory testing excel file. |
## 6. Test Summary and Suggestion
* Refer to the detailed test case documents for specific status, actual results, recommendations, and additional notes for each test scenario.
* Overall, the majority of failed test cases are caused by:
  * Route which is used in helper to check login status before sending protected routes is incorrect. It leads to 404 error.
  * App don't check missing field.
  * App don't retains submitted data where required.
  * Notes are displayed in order of ascending date instead of descending date.
* For some features/ requirements, there is an inconsistency between the UI and the API/DB results. Example:
  | Test case | UI | API | DB | Root cause | Suggestion |
  |:---------:|:--:|:---:|:--:|:-----------|:-----------|
  |TC_UI_12.17 - 12.18, TC_API_09, TC_DB_09: invalid email format| pass| fail| fail| The UI correctly prevents submitting invalid email formats, but the controller does not validate email format, and the User schema does not enforce it.| Add email format validation at both controller level and User schema (e.g., using regex or Mongoose match validator).|
  |TC_UI_12.13, TC_API_07, TC_DB_08: short password| pass| pass| fail | The controller validates password length but the User schema lacks a minLength constraint, causing inconsistent enforcement.| Add `minLength` constraint to password in User schema to ensure consistent validation across layers.|
  |TC_UI_25.02 to 25.04, TC_API_31 to 33, TC_DB_19 - 20: update note fails with missing fields| fail | fail | pass | The update operation uses `findByIdAndUpdate()` without `{ runValidators: true }`, allowing invalid updates to be saved.| Enable `runValidators:true`.|

## 7. Conclusion
* The inconsistencies observed between UI, API, and database layers are primarily due to validation being applied only at certain layers instead of consistently across the system. While the UI often prevents invalid inputs, the API and database do not always enforce the same rules, resulting in mismatched outcomes. Aligning validation logic at the model level (and ensuring controllers and UI follow the same constraints) will help unify behavior across all components and reduce these discrepancies.
(See Section 6 for key root causes. The conclusion below focuses specifically on cross-layer inconsistencies.)

## 8. Test Evidence (Screenshots/Videos)

Screenshots and videos are stored in the `/evidence` folder.

**This folder includes:**
  * A video demonstrating the UI test execution (`evidence/playwright-video`).
  * A screenshot for the Playwright HTML report (`evidence/playwright-report`).
  * A screenshot of the Jest coverage report (`evidence/jest-coverage-report`).
  * A screenshot proving API results (`evidence/API-results`).
  * A screenshot proving database results (`evidence/DB-results`).
  * Screenshots for exploratory testing. File names follow the corresponding test case ID. Example:
    - `evidence/EC_01_longcontent`