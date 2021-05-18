// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

let LOCAL_STORAGE_MEMORY = {};
let SESSION_STORAGE_MEMORY = {};

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
  return LOCAL_STORAGE_MEMORY;
});

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
  return LOCAL_STORAGE_MEMORY;
});

Cypress.Commands.add("saveSessionStorage", () => {
  Object.keys(sessionStorage).forEach(key => {
    SESSION_STORAGE_MEMORY[key] = sessionStorage[key];
  });
  return SESSION_STORAGE_MEMORY;
});

Cypress.Commands.add("restoreSessionStorage", () => {
  Object.keys(SESSION_STORAGE_MEMORY).forEach(key => {
    sessionStorage.setItem(key, SESSION_STORAGE_MEMORY[key]);
  });
  return SESSION_STORAGE_MEMORY;
});