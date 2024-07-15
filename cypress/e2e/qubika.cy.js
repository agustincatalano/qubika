/// <reference types="cypress" />

const RANDOM_STRING = Math.random().toString(36).slice(9);
const EMAIL = `agustin.catalano+${RANDOM_STRING}@qubika.com`;
const CATEGORY_NAME = `qubika+${RANDOM_STRING}`;
describe('interview exercises', () => {
  it(`should create a new user successfully email:${EMAIL}`, () => {
    // Define the user data as per the Swagger definition
    const userData = {
      email: EMAIL,
      password: 'test123',
      roles: ['ROLE_ADMIN']
    };

    // Send a POST request to the API to create a user
    cy.request({
      method: 'POST',
      url: 'https://api.club-administration.qa.qubika.com/api/auth/register',
      body: userData
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });

  it.only(`validate Sports Club with user: ${EMAIL}`, () => {
    cy.intercept('**/category-type/create').as('CATEGORY_CREATED');
    //2) Go to Qubika Sports Club Management System
    cy.visit('/#/auth/login');
    //3)Validate that the login page is displayed correctly (make any relevant validation that you consider necessary)
    cy.url().should('include', '/login');
    cy.get('.card-body').should('be.visible');
    cy.contains('Por favor ingrese correo y contraseña').should('be.visible');
    //4) Log in with the created user
    cy.get('[formcontrolname="email"]').type('agustin.catalano@qubika.com');
    cy.get('[formcontrolname="password"]').type('test123');
    cy.get('[type="submit"]').should('be.visible').click();
    //5) Validate that the user is logged in
    cy.url().should('include', '/dashboard');
    cy.contains('Total de contribuciones').should('be.visible');
    cy.contains('Total de socios').should('be.visible');
    cy.contains('Visitas a la página').should('be.visible');
    //Go to the Category page
    cy.get('a[href="#/category-type"]').click();
    cy.url().should('include', '/category-type');
    //) Create a new category and validate that the category was created successfully
    cy.contains('button', ' Adicionar').click();
    cy.get('[id="input-username"]').type(CATEGORY_NAME);
    cy.contains('[type="submit"]', 'Aceptar').click();
    cy.wait('@CATEGORY_CREATED');
    cy.contains('Tipo de categoría adicionada satisfactoriamente').should('be.visible');
    cy.contains('Tipo de categoría adicionada satisfactoriamente').should('not.be.visible');
    cy.get('[class="page-item ng-star-inserted"]').last().click();
    cy.contains('[class="ng-star-inserted"]', CATEGORY_NAME).should('be.visible');
  });
});
