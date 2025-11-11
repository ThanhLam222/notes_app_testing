# notes_app_testing
> A full-stack testing project covering **UI**, **API**, and **Database** layers for an existing web application.  
This project demonstrates a complete testing workflow — from requirement analysis to automation and reporting.

## 🔧 Tech Stack

**Automation**
- **UI Tests:** Playwright + Page Object Models
- **API Tests:** Supertest + Jest + Mongo Memory Server + Service Object Model
- **Postman:** Included as a demonstration of Postman workflow skills (not the primary testing framework)
- **Data Tests:** Supertest + Jest + Mongo Memory Server
- **CI:** GitHub Actions - Automatically runs test suites on push

**Manual:**
- 1–2 manual test cases to demonstrate manual test workflow and documentation.

## ⭐ Highlights (What makes this project stand out)

- Built **automation framework from scratch** (not based on templates).
- Applied **Page Object Model (POM)** to optimize UI test maintainability.
- Applied **Service Object Model (SOM)** for clean and reusable API test logic.
- Integrated **Mongo Memory Server** → API + DB tests run without external dependencies.
- Configured **CI pipeline** to run all tests automatically on GitHub Actions.
- Wrote complete **Requirements, Test Plan, Test Cases, Test Data, Test Script and Test Report**.
- **Modified source code** of the Notes App to:
  - Improve error handling (`try/catch`)
  - Add second user for authorization test scenarios
  - Fix CI-related environment issues
  - (Demonstrates ability to read and debug production code)
## ▶️ How to Run Tests
### UI Tests
`npm run test-ui`
### API Tests
`npm run test-api`
### Database Tests
`npm run test-db`

Clone the repository, install dependencies with `npm install`, then run tests as described above.
    
**For full project details, see below.**
---
## Overview
I built this testing project from scratch.

**a. This project uses the Notes App cloned from this repository:**
[Notes App repository](https://github.com/fazt/nodejs-notes-app).

However, I made several modifications to the original source code to better support testing:
- Added `try...catch` blocks to prevent the server from crashing in cases where errors were not properly handled.
- Added an additional user (`userB`) alongside the existing default admin account, in order to test authorization and ownership scenarios.
- Fixed the `docker-compose` configuration so the application can run correctly in a CI environment.
- Corrected several spelling mistakes in the original codebase.

These changes were made only to improve application stability and test coverage.
The core logic and application features remain the same as the original repository.

**b. Testing preparation**

I manually analyzed the application's source code and APIs to understand the system workflows, expected behaviors, and endpoint structures.

From this exploration, I identified:
- Application workflows and expected behaviors
- Implicit requirements (not documented in the original project)
- API endpoints and their request/response structures

In addition to extracting requirements from the existing implementation, I also defined several **implied and best-practice requirements** (e.g., validation rules, permission boundaries, error handling behavior).  
As a result, some test cases intentionally **fail**, because they highlight gaps or areas where the current application does not fully meet those best-practice expectations.

Based on this analysis, I developed:
- **Test plan** covering UI, API and Database layers (.docx file):
  - See in `notes_app_testing/02-Test_plan`
  - Or view via Google drive link: [test_plan](https://docs.google.com/document/d/1RP_HDf5Ajb09Ztwvx25Zqxdsdx2noLzo/edit?usp=sharing&ouid=108535092432212488723&rtpof=true&sd=true)
- **Test cases**, including (.xlsx file):
  - Automated tests (UI, API, and database validation)
  - Manual exploratory test scenarios
  - See in:
    - `notes_app_testing/03-Test_case`
    - Or view via Google drive link: [test_cases](https://docs.google.com/spreadsheets/d/1_du5Od-tr1ssKdXy9O8WD9KJFp9eD-CO/edit?usp=sharing&ouid=108535092432212488723&rtpof=true&sd=true)
- **Test data** required to support execution (.xlsx file):
  - See in `notes_app_testing/04-Test_data`
  - Or view via Google drive link: [test_data](https://docs.google.com/spreadsheets/d/1_du5Od-tr1ssKdXy9O8WD9KJFp9eD-CO/edit?usp=sharing&ouid=108535092432212488723&rtpof=true&sd=true)
## Test Scripts
### UI Tests
- **Purpose:** Verify user interface elements, interactions, and end-to-end workflows from the user's perspective. Covers common user flows such as creating, updating, and deleting notes, as well as authentication UI.
- **Framework and Tool:** Playwright
- **Design pattern:** Page Object Model
- **Run command:** `npm run test-ui`
- **Location:** `notes_app_testing/05-Test_script/01-UI_test`
### API Tests
- **Purpose:** Validate backend API endpoints, including request/response correctness, authentication, authorization, data validation, and error handling. Ensures API complies with specifications derived from both source code and best-practice requirements.
- **Framework and Tool:** Supertest + Jest + Mongo Memory Server
- **Design pattern:** Service Object Model
- **Run command:** `npm run test-api`
- **Location:** `notes_app_testing/05-Test_script/02-API_test`
### Database Tests
- **Purpose:** Verify database operations, including data creation, retrieval, update, and deletion. Confirms that business logic is correctly reflected in the database and that test data is properly handled in isolation (using Mongo Memory Server).
- **Framework and Tool:** Supertest + Jest + Mongo Memory Server
- **Run command:** `npm run test-db`
- **Location:** `notes_app_testing/05-Test_script/03-DB_test`
### Postman Tests
- **Purpose:** Validate backend API endpoints with all happy cases to demonstrate Postman skills.
- **Location:**
  - `notes_app_testing/05-Test_script/04-postman_test`:
    - This folder contains
      -  `note_data.json`
      -  Collection `.json` file
      -  Environment variables `.json` file
      -  Evidence of run by collection runner.
  - Or view directly via **Postman workspace:**
    - [Authentication Collection](https://www.postman.com/spaceflight-technologist-5034671-5912520/workspace/note-app-testing/collection/46966736-5ae454b4-7d52-4f52-84fd-ab1feef5e43b?action=share&creator=46966736&active-environment=46966736-516838b3-6ec2-4bd6-84e4-ff91e92a9991)
    - [CRUD Note Collection](https://www.postman.com/spaceflight-technologist-5034671-5912520/workspace/note-app-testing/collection/46966736-561c1204-3120-4108-a907-e8e39b539b4c?action=share&creator=46966736&active-environment=46966736-516838b3-6ec2-4bd6-84e4-ff91e92a9991)
    - [Public Page Collection](https://www.postman.com/spaceflight-technologist-5034671-5912520/workspace/note-app-testing/collection/46966736-f5416667-78a1-4d75-a162-e4075e437eb8?action=share&creator=46966736&active-environment=46966736-516838b3-6ec2-4bd6-84e4-ff91e92a9991)
## Test Report
- **Purpose:** Summarize test results and provide recommendations to fix source code.
- **Location:**
  - `notes_app_testing/06-Test_report/`
  - This folder includes:
    - `test_report.md`
    - Evidence such as: video and snapshot of UI, API, Database, and manual test (except Postman).
## Project Structure
```
notes_app/
notes_app_testing/
├── 01-Requirements/
├── 02-Test_plan/
├── 03-Test_case/
├── 04-Test_data/
├── 05-Test_script/
|   ├── 01-UI_test/
|   |   ├── 01-POM/
|   |   ├── 02-fixtures/
|   |   ├── 03-helpers/
|   |   ├── 04-tests/
|   |   └── playwright.config.js
|   ├── 02-API_test/
|   |   ├── 01-SOM/
|   |   ├── 02-ultils/
|   |   ├── 03-helpers/
|   |   └── 04-tests/
|   ├── 03-DB_test/
|   |   ├── 01-helpers/
|   |   ├── 02-test/
|   |   └── NOTE.md
|   ├── 04-postman_test/
|   |   ├── evidence/
|   |   ├── postman_collection_variables/
|   |   ├── noteData.json
|   |   └── noteDataHelper.js
|   ├── data/
|   ├── jest.config.mjs
|   ├── package-lock.json
|   └── package.json
└── 06-Test_report/
    ├── evidence
    └── test_report.md
```



