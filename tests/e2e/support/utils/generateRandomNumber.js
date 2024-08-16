/* eslint-disable no-restricted-properties */
Cypress.Commands.add('generateRandomNumber', numberLength => Math.floor(Math.pow(10, numberLength - 1) + Math.random() * 9 * Math.pow(10, numberLength - 1)))
