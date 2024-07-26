
# TEST AUTOMATION FRAMEWORK with Playwright for TODO (demo)




## Tech Stack

**Programming language:** _JavaScript_

**Testing library:** _Playwright_ 
-   > Any browser • Any platform • One API 
-   > Resilient • No flaky tests 
-   > No trade-offs • No limits 
-   > Full isolation • Fast execution 
-   > Powerful Tooling






### 
## Prerequisites
- install Node.js ```https://nodejs.org/en/download/package-manager```
- install Homebrew ```/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"```
- install Allure Report ```brew install allure```
- install dependencies: ```npm i```

**VSCode extensions:** 
* Playwright Test for VSCode
* ESlint (After install, make sure the ESlint server is up and running; if not, cmd+shift+p: type "restart ESlint")
###
## Running Tests

**To run tests, run the following command:**

```npm run test``` (running tests)

```npm run test:ui``` (running tests using the Playwright GUI)

```npm run test:debug``` (running tests allowing you to debug stepByStep *just be careful by typing in desired test in 'test_name' from package.json*)

```npm run test:generateReport``` (generating Allure report)

```npm run test:showReport``` (opening Allure report)

**Current Strategy** 
* at the moment we do not have limitations running tests (having 4 workers but feel free to change number of workers based on your resources)





###
## Documentation

[Playwright](https://playwright.dev/docs/intro)

[Automation testing strategy](https://softgenius.atlassian.net/wiki/spaces/SoftGenius/pages/211517493/Automation+Testing+Strategy)

[Github](https://github.com/microsoft/playwright/issues/14956)


