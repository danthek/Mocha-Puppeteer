import { expect } from 'chai'
import { step } from 'mocha-steps'

import Page from '../builder'
import LoginPage from '../pages/LoginPage'

describe('Mocha Steps Demo', () => {
  let page
  before(async function () {
    page = await Page.build('Desktop')
  })
  after(async function () {
    await page.close()
  })
  step('should load google homepage', async function () {
    await page.goto('https://google.com')
  })
  step('Step 2', async function () {
    console.log('From Step 2')
  })
  step('Step 3 Shoudl Fail', async function () {
    await page.waitAndClick('#FAIL')
  })
  step('Step 4', async function () {
    console.log('From Step 4')
  })
})

describe('End-to-end Test', () => {
  let page
  let loginPage

  before(async () => {
    page = await Page.build('Desktop') // we will build our new browser page with the instructions insde build and as a desktop viewport
    loginPage = await new LoginPage(page)
  })

  after(async () => {
    await page.close()
  })

  step('should load homepage', async () => {
    await page.goto('http://zero.webappsecurity.com/index.html')
    const signInButton = await page.isElementVisible('#signin_button')
    expect(signInButton).to.be.true
  })

  step('should display login form', async () => {
    await page.waitAndClick('#signin_button')
    const loginForm = await page.isElementVisible('#login_form')
    expect(loginForm).to.be.true
    const signInButton = await page.isElementVisible('#signin_button')
    expect(signInButton).to.be.false
  })
  step('should have 6 navabr links', async () => {
    expect(await page.getCount('.nav-tabs li')).to.equal(6)
  })

  step('should login to application', async () => {
    await loginPage.login('username', 'password')
    const navbar = await page.isElementVisible('.nav-tabs')
    expect(navbar).to.be.true
  })
})
