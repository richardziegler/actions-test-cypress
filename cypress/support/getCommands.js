const dayjs = require("dayjs");

Cypress.Commands.add("gotoOrder", (processOrder) => {
  cy.visit("http://localhost:3001/ENK");
  cy.get('input[data-test="ord-search-field"]').type(processOrder);
});

Cypress.Commands.add("clickTab", (tab) => {
  cy.contains(tab).trigger("mouseover").click();
});

Cypress.Commands.add("clickAppOperationButton", () => {
  cy.get('button[data-test="ord-add-op-button"]').trigger("mouseover").click();
});

Cypress.Commands.add("enterInput", (input, quantity) => {
  cy.get(`input[data-test="input-form-${input}-field"]`).type(quantity);
});

Cypress.Commands.add("enterEquipment", (equipment) => {
  cy.get('input[data-test="add-op-form-equip-field"]').type(equipment);
});

// Cypress.Commands.add('enterEquipment'), () => {
//   return cy.get('input[data-test="add-op-form-equip-field"]')
// }

Cypress.Commands.add("addOperation", (equipment, operation) => {
  //can't reference commands in commands I guess?
  //cy.clickAddOperationButton();
  //cy.enterEquipment(equipment);

  cy.get('button[data-test="ord-add-op-button"]').trigger("mouseover").click();
  cy.focused().should("have.class", "mdc-text-field__input");
  cy.get('input[data-test="add-op-form-equip-field"]').type(equipment);
  if (operation) {
    cy.get('div[data-test="add-op-form-op-select"]').click();
    cy.get('li[class="lmnt mdc-list-item"]')
      .contains(operation)
      .parent()
      .click();
  }
  cy.get('button[data-test="add-op-form-save-button"]')
    .contains("Save")
    .trigger("mouseover")
    .click();
});

// NOTE: Should we be looking for index here instead of last? Maybe check for last if index isn't passed?
Cypress.Commands.add("startOperation", (index, operation) => {
  //Should we add check for button text here?
  cy.get(`div[data-test="op-${index}-${operation}"]`)
    .find('button[data-test="op-action"]')
    .trigger("mouseover")
    .click();
});

Cypress.Commands.add("startOperationLast", () => {
  return cy.get('button[data-test="op-action"]').last();
});

Cypress.Commands.add("lastOperation", () => {
  return cy.get('div[data-test="ord-op-list"]').children().last();
});

Cypress.Commands.add("stopOperationLast", () => {
  //Should we add check for button text here?
  return cy.get(`button[data-test="op-action"]`).last();
});

Cypress.Commands.add("stopOperation", (index, operation) => {
  //Should we add check for button text here?
  cy.get(`div[data-test="op-${index}-${operation}"]`)
    .find('button[data-test="op-action"]')
    .trigger("mouseover")
    .click();
});

Cypress.Commands.add("orderState", () => {
  return cy.get('div[data-test="ord-state"]').contains(state);
});

Cypress.Commands.add("orderMenuButton", () => {
  return cy.get('button[data-test="ord-menu-button"]');
});

Cypress.Commands.add("orderMenuComplete", () => {
  return cy.get('li[data-test="ord-menu-complete"]');
});

Cypress.Commands.add('defaultUom', () => {
    return cy.get('span[class="mdc-select__selected-text"]');
  });

Cypress.Commands.add("uomList", (input) => {
  return cy
    .get(`div[data-test="input-form-${input}-field-uom-select"]`)
    .children()
    .get('ul[class="lmnt mdc-list"]')
    .children();
});

Cypress.Commands.add("collectedBatchCount", (count) => {
  return cy.get('div[data-test="input-form-batch-count"]');
});

Cypress.Commands.add("collectedBatchCount", () => {
  return cy.get('div[data-test="input-form-batch-count"]');
});

Cypress.Commands.add("requiredBatch", (batch) => {
  return cy
    .get('div[data-test="input-form-batch-area"]')
    .contains("div", batch);
});

Cypress.Commands.add(
  "getOperationsLength",
  () => cy.get('div[data-test="ord-op-list"]').children().length
);

Cypress.Commands.add("operationsNameLast", () =>
  cy.get('div[data-test="op-name"]').last()
);

Cypress.Commands.add("input", (input) => {
  return cy.get(`input[data-test="input-form-${input}-field"]`).parent();
});

Cypress.Commands.add("inputFormButton", () => {
  return cy.get('button[data-test="input-form-button"]').first();
});

Cypress.Commands.add(
  "batchInRequiredBatchesShouldHaveClass",
  (batch, className) => {
    return cy
      .get('div[data-test="input-form-batch-area"]')
      .contains("div", batch)
      .should("have.class", className);
  }
);

Cypress.Commands.add("requiredBatchesArea", (className) => {
  return cy.get('div[data-test="input-form-batch-area"]');
});

Cypress.Commands.add("inputShouldHaveFocus", (input) => {
  cy.focused().should("have.attr", "data-test", `input-form-${input}-field`);
});

Cypress.Commands.add("inputForm", () => {
  return cy.get('div[data-test="input-form"]');
});

Cypress.Commands.add("orderState", () => {
  return cy.get('div[data-test="ord-state"]');
});

Cypress.Commands.add("operationStartTime", () => {
  return cy.get('span[data-test="op-start-time"]').last();
});

//should be coming in from operation parent here!!
Cypress.Commands.add("operationShouldBeStarted", () => {
  cy.get('div[data-test="ord-state"]').should("have.class", "text-yellow-500");
  cy.wait(500);
  cy.get('span[data-test="op-start-time"]')
    .last()
    .should(($span) => {
      const date = dayjs($span.text()).unix();
      const now = dayjs().unix();
      expect(date).to.be.closeTo(now, 30);
    });
});

Cypress.Commands.add("operationShouldBeCompleted", () => {
  //cy.get('div[data-test="ord-state"]').should('have.class', 'text-yellow-500')
  //why different from started check above?
  cy.get('svg[data-test="op-status-icon"]').should(
    "have.class",
    "text-green-700"
  );
  cy.wait(500);
  cy.get('span[data-test="op-end-time"]')
    .last()
    .should(($span) => {
      const date = dayjs($span.text()).unix();
      const now = dayjs().unix();
      expect(date).to.be.closeTo(now, 30);
    });
});

Cypress.Commands.add("verifyAndClick", { prevSubject: "element" }, (subject, options) => {
    // wrap the existing subject and do something with it
    cy.wrap(subject).then(($el) => {
      while (Cypress.dom.isDetached($el)) {
        //no-op
      }
      $el.trigger("mouseover").click();
    });
  }
);

Cypress.Commands.add('shouldBeStarted', {prevSubject: 'element'}, (subject, options) => {
  cy.wrap(subject).then(($el) => {
      console.log(subject);
      console.log($el);
      expect($el.find('svg[data-test="op-status-icon"]')).to.have.class('text-yellow-500');
      cy.wait(500);
      const date = dayjs($el.find('span[data-test="op-start-time"]').text()).unix();
      const now = dayjs().unix();
      expect(date).to.be.closeTo(now, 30);
  });
});

Cypress.Commands.add('shouldBeCompleted', {prevSubject: 'element'}, (subject, options) => {
  cy.wrap(subject).then(($el) => {
      console.log(subject);
      console.log($el);
      expect($el.find('svg[data-test="op-status-icon"]')).to.have.class('text-green-700');
      cy.wait(500);
      const date = dayjs($el.find('span[data-test="op-end-time"]').text()).unix();
      const now = dayjs().unix();
      expect(date).to.be.closeTo(now, 30);
  });
});
