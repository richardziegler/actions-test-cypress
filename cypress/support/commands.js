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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
const dayjs = require("dayjs");

Cypress.Commands.add('gotoOrder', (processOrder) => {
  cy.visit("/ENK");
  cy.get('input[data-test="ord-search-field"]').type(processOrder);
});

Cypress.Commands.add('clickTab', (tab) => {
  cy.contains(tab).trigger('mouseover').click();
});

Cypress.Commands.add('clickAppOperationButton', () => {
  cy.get('button[data-test="ord-add-op-button"]').then(($el) => {
    while (Cypress.dom.isDetached($el)){
     //no-op 
    }
    $el.trigger('mouseover').click();
  })
  //cy.get('button[data-test="ord-add-op-button"]').trigger('mouseover').click();
});

Cypress.Commands.add('enterInput', (input, quantity) => {
  cy.get(`input[data-test="input-form-${input}-field"]`).type(quantity);
});

Cypress.Commands.add('enterEquipment', (equipment) => {
  cy.get('input[data-test="add-op-form-equip-field"]').type(equipment);
});

Cypress.Commands.add('addOperation', (equipment, operation) => {
  //can't reference commands in commands I guess?
  //cy.clickAddOperationButton();
  //cy.enterEquipment(equipment);

  //cy.get('button[data-test="ord-add-op-button"]').trigger('mouseover').click();
  cy.get('button[data-test="ord-add-op-button"]').then(($el) => {
    while (Cypress.dom.isDetached($el)){
     //no-op 
    }
    $el.trigger('mouseover').click();
  })
  cy.focused().should('have.class', 'mdc-text-field__input');   
  cy.get('input[data-test="add-op-form-equip-field"]').type(equipment)
  //cy.get('button[data-test="add-op-form-save-button"]').contains('Save').trigger('mouseover').click();
  cy.get('button[data-test="add-op-form-save-button"]').contains('Save').then(($el) => {
    while (Cypress.dom.isDetached($el)){
     //no-op 
    }
    $el.trigger('mouseover').click();
  })
})

Cypress.Commands.add('startOperation', (index, operation) => {
  //Should we add check for button text here?
  //cy.get(`div[data-test="op-${index}-${operation}"]`).find('button[data-test="op-action"]').trigger('mouseover').click();
  cy.get(`div[data-test="op-${index}-${operation}"]`).find('button[data-test="op-action"]').then(($el) => {
    while (Cypress.dom.isDetached($el)){
     //no-op 
    }
    $el.trigger('mouseover').click();
  })
});

Cypress.Commands.add('stopOperation', (index, operation) => {
  //Should we add check for button text here?
  //cy.get(`div[data-test="op-${index}-${operation}"]`).find('button[data-test="op-action"]').trigger('mouseover').click();
  cy.get(`div[data-test="op-${index}-${operation}"]`).find('button[data-test="op-action"]').then(($el) => {
    while (Cypress.dom.isDetached($el)){
     //no-op 
    }
    $el.trigger('mouseover').click();
  })
});

Cypress.Commands.add('orderStateShouldBe', (state) => {
  cy.get('div[data-test="ord-state"]').contains(state);
});

Cypress.Commands.add('inputShouldHaveUoms', (input, selectedUom, uoms) => {
  //Need to get uom after the correct input here!
  cy.get('span[class="mdc-select__selected-text-container"]').contains('span', selectedUom).should('have.text', selectedUom)
  for (const uom of uoms){
    cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', uom)
  }
});

Cypress.Commands.add('collectedBatchCountShouldBe', (count) => {
  cy.get('div[data-test="input-form-batch-count"]').should('have.text', count)
});

Cypress.Commands.add('requiredBatchesShouldBe', (batches) => {
  for (const batch of batches){
    cy.get('div[data-test="input-form-batch-area"]').contains('div', batch).should('have.text', batch);
  }
});

Cypress.Commands.add('inputShouldBeRequired', (input) => {
  cy.get(`input[data-test="input-form-${input}-field"]`).parent().should('have.class', 'mdc-text-field--invalid');
});

Cypress.Commands.add('inputShouldBeOptional', (input) => {
  cy.get(`input[data-test="input-form-${input}-field"]`).parent().should('not.have.class', 'mdc-text-field--invalid');
});

Cypress.Commands.add('inputFormButtonShouldBeDisabled', () => {
  cy.get('button[data-test="input-form-button"]').should('be.disabled');
});

Cypress.Commands.add('inputFormButtonShouldBeEnabled', () => {
  cy.get('button[data-test="input-form-button"]').should('not.be.disabled');
});

Cypress.Commands.add('inputFormButtonShouldRead', (label) => {
  cy.get('button[data-test="input-form-button"]').first().should('have.text', label);
});

Cypress.Commands.add('batchInRequiredBatchesShouldHaveClass', (batch, className) => {
  cy.get('div[data-test="input-form-batch-area"]').contains('div', batch).should('have.class', className);
});

Cypress.Commands.add('requiredBatchesAreaShouldHaveClass', (className) => {
  cy.get('div[data-test="input-form-batch-area"]').should('have.class', className);
});

Cypress.Commands.add('clickInputFormButton', () => {
  //cy.get('button[data-test="input-form-button"]').trigger('mouseover').click();
  cy.get('button[data-test="input-form-button"]').then(($el) => {
    while (Cypress.dom.isDetached($el)){
     //no-op 
    }
    $el.trigger('mouseover').click();
  })
});

Cypress.Commands.add('inputShouldBeEmpty', (input) => {
  cy.get(`input[data-test="input-form-${input}-field"]`).should('have.value', '');
});

Cypress.Commands.add('inputShouldHaveFocus', (input) => {
  cy.focused().should('have.attr', 'data-test', `input-form-${input}-field`);
});

Cypress.Commands.add('inputFormShouldBeDismissed', () => {
  cy.get('div[data-test="input-form"]').should('not.exist');
});

Cypress.Commands.add('inputFormShouldBeActivated', () => {
  cy.get('div[data-test="input-form"]').should('exist');
});


//should be coming in from operation parent here!!
Cypress.Commands.add('operationShouldBeStarted', () => {
  cy.get('div[data-test="ord-state"]').should('have.class', 'text-yellow-500')
  cy.wait(500)
  cy.get('span[data-test="op-start-time"]').last().should(($span => {
      const date = dayjs($span.text()).unix()
      const now = dayjs().unix()
      expect(date).to.be.closeTo(now, 30)
  }))
});

Cypress.Commands.add('operationShouldBeCompleted', () => {
  //cy.get('div[data-test="ord-state"]').should('have.class', 'text-yellow-500')
  //why different from started check above?
  cy.get('svg[data-test="op-status-icon"]').should('have.class', 'text-green-700')
  cy.wait(500)
  cy.get('span[data-test="op-end-time"]').last().should(($span => {
      const date = dayjs($span.text()).unix()
      const now = dayjs().unix()
      expect(date).to.be.closeTo(now, 30)
  }))
});
