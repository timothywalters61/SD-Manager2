//imports
const { checkDateBeforeCurrentDate, checkIsNotANumber, isValidEmail, containsInput, isValidRepoLink, isValidNameOrSurname, isValidUsername } = require('./embeddedFunctions');

//tests initializations
const puppeteer = require('puppeteer');
const select = require('puppeteer-select');
const { doesNotMatch } = require('assert');
const { title } = require('process');
expect = require('chai').expect
should = require('chai').should()
_ = require('lodash')

//tests
describe('embedded function tests - used for input validation before passed to firebase', () => {

    it('check if 03/25/2015 is before current date - must return true', () => {
        let date = new Date("03/25/2015");
        let value = checkDateBeforeCurrentDate(date);
        expect(value).to.equal(true);
    });

    it('check if 03/25/2021 is before current date  - must return false', () => {
        //javascript format dd/mm/yy...
        let date = new Date("03/25/2021");
        let value = checkDateBeforeCurrentDate(date);
        expect(value).to.equal(false);
    });

    it('(hello) check if it is not a number - must return true', () => {
        let value = checkIsNotANumber('hello');
        expect(value).to.equal(true);
    });

    it('(hello guys) check if it is not a number - must return true', () => {
        let value = checkIsNotANumber('hello guys');
        expect(value).to.equal(true);
    });

    it('(8) check if it is not a number - must return false', () => {
        let value = checkIsNotANumber('8');
        expect(value).to.equal(false);
    });

    it('(42) check if it is not a number - must return false', () => {
        let value = checkIsNotANumber('42');
        expect(value).to.equal(false);
    });
    it('(hello) check if it is an email - must return false', () => {
        let value = isValidEmail('hello');
        expect(value).to.equal(false);
    });

    it('(hello guys) check if it is an email - must return false', () => {
        let value = isValidEmail('hello guys');
        expect(value).to.equal(false);
    });

    it('(8) check if it is an email - must return false', () => {
        let value = isValidEmail('8');
        expect(value).to.equal(false);
    });

    it('(42) check if it is an email - must return false', () => {
        let value = isValidEmail('42');
        expect(value).to.equal(false);
    });
    it('(tim007@gmail.com) check if it is an email - must return true', () => {
        let value = isValidEmail('tim007@gmail.com');
        expect(value).to.equal(true);
    });

    it('(tim007@gmail . com) check if it is an email - must return false', () => {
        let value = isValidEmail('tim007@gmail . com');
        expect(value).to.equal(false);
    });
    it('(hello guys) check if it has a length bigger than 0 - must return true', () => {
        let value = containsInput('hello guys');
        expect(value).to.equal(true);
    });

    it('() check if it has a length bigger than 0 - must return false', () => {
        let value = containsInput('');
        expect(value).to.equal(false);
    });

    it('(42) check if it has a length bigger than 0 - must return true', () => {
        let value = containsInput('42');
        expect(value).to.equal(true);
    });
    it('(hello guys) check if it is a valid repo link - must return false', () => {
        let value = isValidRepoLink('hello guys');
        expect(value).to.equal(false);
    });

    it('() check if it is a valid repo link - must return false', () => {
        let value = isValidRepoLink('');
        expect(value).to.equal(false);
    });

    it('(42) check it is a valid repo link - must return false', () => {
        let value = isValidRepoLink('42');
        expect(value).to.equal(false);
    });

    it('(www.github.com) check it is a valid repo link - must return false', () => {
        let value = isValidRepoLink('www.github.com');
        expect(value).to.equal(false);
    });

    it('(https://github.com/timothywalters61/SD-Manager/tree/JCR1999/public) check it is a valid repo link - must return true', () => {
        let value = isValidRepoLink('https://github.com/timothywalters61/SD-Manager/tree/JCR1999/public');
        expect(value).to.equal(true);
    });

    it('(wwww.github.com/timothywalters61/SD-Manager/tree/JCR1999/public) check it is a valid repo link - must return false', () => {
        let value = isValidRepoLink('www.github.com/timothywalters61/SD-Manager/tree/JCR1999/public');
        expect(value).to.equal(false);
    });

    it('(https://github/timothywalters61/) check it is a valid repo link - must return false', () => {
        let value = isValidRepoLink('https://github/timothywalters61/');
        expect(value).to.equal(false);
    });

    it('(task1) check it is a valid task name - must return true', () => {
        let value = containsInput('task1');
        expect(value).to.equal(true);
    });

    it('() check it is a valid task name - must return false', () => {
        let value = containsInput('');
        expect(value).to.equal(false);
    });

    it('(James) check it is a valid first name - must return true', () => {
        let value = isValidNameOrSurname('James');
        expect(value).to.equal(true);
    });

    it('(Bond) check it is a valid last name - must return true', () => {
        let value = isValidNameOrSurname('Bond');
        expect(value).to.equal(true);
    });

    it('(jamesbond123) check it is a valid username - must return true', () => {
        let value = isValidUsername('jamesbond');
        expect(value).to.equal(true);
    });

    it('(2) check it is a valid first name - must return false', () => {
        let value = isValidNameOrSurname('2');
        expect(value).to.equal(false);
    });

    it('(12) check it is a valid last name - must return false', () => {
        let value = isValidNameOrSurname('12');
        expect(value).to.equal(false);
    });

    it('(1) check it is a valid username - must return false', () => {
        let value = isValidUsername('1');
        expect(value).to.equal(false);
    });

    it('() check it is a valid username - must return false', () => {
        let value = isValidUsername('');
        expect(value).to.equal(false);
    });

});
describe('end to end tests - used to check business logic with javascript and firebase', () => {

    it('sprint 7 end to end website functionality', async () => {
        const browser = await puppeteer.launch({
            headless: true, //must be set to true for circleci to work!
            slowMo: 25,
            args: ['--window-size=1440,900']
        });
        const page = await browser.newPage();
        await page.goto(
            'https://scrum-manager-91e13.web.app'
        );
        //log in process
        await page.click('#loginBtn');
        await page.click('#login-email');
        await page.type('#login-email', 'timothywalters@gmail.com');
        await page.click('#login-password');
        await page.type('#login-password', '12345678');
        await page.click('#login-button');
        //await page.waitFor(5000);

        //enter a project
        await page.waitForSelector('body > .container > #projectContainer > #i9xC13fgN7u4hHiBfSdd > a');
        await page.click('body > .container > #projectContainer > #i9xC13fgN7u4hHiBfSdd > a');
        await page.waitForSelector('.swal-overlay > .swal-modal > .swal-footer > .swal-button-container > .swal-button--openProject');
        await page.click('.swal-overlay > .swal-modal > .swal-footer > .swal-button-container > .swal-button--openProject');

        //wait...
        await page.waitFor(5000);

        //enter a sprint
        await page.waitForSelector('#sprintContainer > div > a');
        await page.click('#sprintContainer > div > a');

        //wait...
        await page.waitFor(2500);

        //enter a user story
        await page.waitForSelector('#In\\ Progress > div > button:nth-child(5)');
        await page.click('#In\\ Progress > div > button:nth-child(5)');

        //wait...
        await page.waitFor(2500);

        //move task
        const example = await page.$('#InProgress > div.tasks > p.userStoryName');
        await page.mouse.move(126, 19);
        await page.mouse.down();
        await page.mouse.move(126, 19);
        await page.mouse.up();

        //update a task
        await page.waitForSelector('.cat-container > #InProgress > #ip-tasks #btnEdit');
        await page.click('.cat-container > #InProgress > #ip-tasks #btnEdit');

        await page.waitForSelector('#editTaskTitle');
        await page.$eval('#editTaskTitle', el => el.value = 'task-puppeteer');
        // await page.type('#editTaskTitle', 'task-puppeteer');

        await page.waitForSelector('#editTask-assign-to');
        await page.click('#editTask-assign-to');

        await page.select('#editTask-assign-to', 'timothywalters1');

        await page.waitForSelector('body #editTask #createTask-button');
        await page.click('body #editTask #createTask-button');

        //wait...
        await page.waitFor(2500);

        //go back
        await page.waitForSelector('body > .container > .navigation > .backBtn > img');
        await page.click('body > .container > .navigation > .backBtn > img');

        //go to team
        await page.waitForSelector('#contentContainer > .subNav > ul > li:nth-child(3) > a')
        await page.click('#contentContainer > .subNav > ul > li:nth-child(3) > a')

        //add existing team member
        await page.waitForSelector('.subNav #Btn')
        await page.click('.subNav #Btn')

        await page.waitForSelector('.user-box #add-email')
        await page.click('.user-box #add-email')
        await page.type('.user-box #add-email', 'help');

        //close team member assignment
        await page.waitForSelector('#modal > a')
        await page.click('#modal > a')

        // const bodyHandle = await page.$('body');
        // const html = await page.evaluate(body => body.innerText, bodyHandle);
        // var tempHtml=html;
        // var temp=tempHtml.includes("timothywalters")
        // console.info(`${temp}`);
        await browser.close();
    }, 200000);

    it('sprint 7 end to end website functionality - sign up conditions check', async () => {
        const browser = await puppeteer.launch({
            headless: true, //must be set to true for circleci to work!
            slowMo: 25,
            args: ['--window-size=1440,900']
        });
        const page = await browser.newPage();
        await page.goto(
            'https://scrum-manager-91e13.web.app'
        );
        //sign up process
        await page.waitForSelector('#signUpBtn');
        await page.click('#signUpBtn');

        await page.waitForSelector('#signup-email');
        await page.$eval('#signup-email', el => el.value = 'timothywalters@gmail.com');

        await page.waitForSelector('#signup-username');
        await page.$eval('#signup-username', el => el.value = 'timothywalters');

        await page.waitForSelector('#signup-firstname');
        await page.$eval('#signup-firstname', el => el.value = 'Timothy');

        await page.waitForSelector('#signup-lastname');
        await page.$eval('#signup-lastname', el => el.value = 'Walters');

        await page.waitForSelector('#signup-password');
        await page.$eval('#signup-password', el => el.value = '12345678');

        await page.waitForSelector('#signup-confirmpassword');
        await page.$eval('#signup-confirmpassword', el => el.value = '12345678');
        
        await browser.close();
    }, 200000);
});

