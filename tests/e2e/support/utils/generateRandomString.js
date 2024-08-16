Cypress.Commands.add('generateRandomString', (stringLength) => {
  let randomString = ''
  let randomAscii;
  for (let i = 0; i < stringLength; i++) {
    randomAscii = Math.floor((Math.random() * 25) + 97)
    randomString += String.fromCharCode(randomAscii)
  }
  return randomString
})
