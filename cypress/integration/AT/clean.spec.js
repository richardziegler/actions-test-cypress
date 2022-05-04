const { describe, it } = require("mocha");
const dayjs = require("dayjs");
const SCANNED_BATCH_CLASS = "text-blue-700";
const ALL_BATCHES_SCANNED_CLASS = "bg-green-100";
const INVALID_TEXT_FIELD = "mdc-text-field--invalid";

describe("Perform Clean/Sizing operation on PO", () => {
  it("Clean Zeefmachine-88", function () {
    cy.gotoOrder("104342662");
    cy.clickTab("Tasks");
    cy.addOperation("Zeefmachine-88", "Cleaning");
    cy.orderState().should("have.text", "In Progress");

    cy.startOperationLast().verifyAndClick();
    cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
    if (cy.getOperationsLength() > 1) {
      cy.input("quantity").should("have.class", INVALID_TEXT_FIELD);
    } else {
      cy.input("quantity").should("not.have.class", INVALID_TEXT_FIELD);
    }

    cy.requiredBatch("0212670360").should("have.text", "0212670360");
    cy.collectedBatchCount().should("have.text", "0/1");
    cy.defaultUom().should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "MK");
    cy.uomList('quantity').should("contain.text", "LB");
    cy.uomList('quantity').should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KPS");
    cy.inputFormButton().should("have.text", "Start");
    cy.inputFormButton().should("be.disabled");

    cy.input("batch").type("0212670360");
    cy.requiredBatch("0212670360").should("have.class", SCANNED_BATCH_CLASS);

    cy.input("quantity").type("15.210");
    cy.collectedBatchCount().should("have.text", "1/1");
    cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
    cy.inputFormButton().verifyAndClick();

    cy.inputForm().should("not.exist");
    cy.orderState().should("have.class", "text-yellow-500");
    cy.wait(1000);
    cy.operationStartTime().should(($span) => {
      const date = dayjs($span.text()).unix();
      const now = dayjs().unix();
      expect(date).to.be.closeTo(now, 30);
    });

    cy.stopOperationLast().verifyAndClick();
  });

  it("Clean Voorschoner", () => {
    cy.addOperation("Voorschoner-56");
    cy.orderState().should("have.text", "In Progress");

    cy.startOperationLast().verifyAndClick();
    cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
    if (cy.getOperationsLength() > 1) {
      cy.input("quantity").should("have.class", INPUT_INVALID);
    } else {
      cy.input("quantity").should("not.have.class", INVALID_TEXT_FIELD);
    }

    cy.requiredBatch("0212670360").should("have.text", "0212670360");
    cy.collectedBatchCount().should("have.text", "0/1");
    cy.defaultUom().should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "MK");
    cy.uomList('quantity').should("contain.text", "LB");
    cy.uomList('quantity').should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KPS");
    cy.inputFormButton().should("have.text", "Start");
    cy.inputFormButton().should("be.disabled");

    cy.input("batch").type("0212670360");
    cy.requiredBatch("0212670360").should("have.class", SCANNED_BATCH_CLASS);

    cy.input("quantity").type("10.370");
    cy.collectedBatchCount().should("have.text", "1/1");
    cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);

    cy.wait(300);
    cy.inputFormButton().verifyAndClick();
    cy.inputForm().should("not.exist");
    cy.orderState().should("have.class", "text-yellow-500");
    cy.wait(1000);
    cy.operationStartTime().should(($span) => {
      const date = dayjs($span.text()).unix();
      const now = dayjs().unix();
      expect(date).to.be.closeTo(now, 30);
    });

    cy.stopOperationLast().verifyAndClick();
  });

  it("Sizing Zeefmachine 6 vlaks-2935", () => {
    cy.addOperation("Zeefmachine 6 vlaks-2935", "Sizing");
    cy.orderState().should("have.text", "In Progress");

    cy.startOperationLast().verifyAndClick();
    cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
    cy.input("quantity").should("have.class", INVALID_TEXT_FIELD);

    // Input Batches
    cy.requiredBatch("0212670360").should("have.text", "0212670360");
    cy.collectedBatchCount().should("have.text", "0/1");
    cy.defaultUom().should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "MK");
    cy.uomList('quantity').should("contain.text", "LB");
    cy.uomList('quantity').should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KPS");
    cy.inputFormButton().should("have.text", "Start");
    cy.inputFormButton().should("be.disabled");

    cy.input("batch").type("0212670360");
    cy.requiredBatch("0212670360").should("have.class", SCANNED_BATCH_CLASS);

    cy.input("quantity").type("10.32");
    cy.collectedBatchCount().should("have.text", "1/1");
    cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);

    cy.wait(300);
    cy.inputFormButton().verifyAndClick();
    cy.wait(300);
    cy.inputForm().should("not.exist");
    cy.orderState().should("have.class", "text-yellow-500");
    cy.wait(300);
    cy.operationStartTime().should(($span) => {
      const date = dayjs($span.text()).unix();
      const now = dayjs().unix();
      expect(date).to.be.closeTo(now, 30);
    });

    // Output Batches
    cy.stopOperationLast().verifyAndClick();
    cy.inputForm().should("exist");
    cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
    cy.input("quantity").should("not.have.class", INVALID_TEXT_FIELD);
    cy.requiredBatch("0212722155").should("have.text", "0212722155");
    cy.requiredBatch("0212722156").should("have.text", "0212722156");
    cy.requiredBatch("0212722157").should("have.text", "0212722157");
    cy.requiredBatch("0212722158").should("have.text", "0212722158");
    cy.collectedBatchCount().should("have.text", "0/4");
    cy.defaultUom().should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "MK");
    cy.uomList('quantity').should("contain.text", "LB");
    cy.uomList('quantity').should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KPS");
    cy.inputFormButton().should("have.text", "Save");
    cy.inputFormButton().should("be.disabled");

    cy.input("batch").type("0212722155");
    cy.requiredBatch("0212722155").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("1.935");
    cy.collectedBatchCount().should("have.text", "1/4");
    cy.wait(300);
    cy.inputFormButton().verifyAndClick();

    cy.input("batch").type("0212722156");
    cy.requiredBatch("0212722156").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("7.450");
    cy.collectedBatchCount().should("have.text", "2/4");
    cy.wait(300);
    cy.inputFormButton().verifyAndClick();

    cy.input("batch").type("0212722157");
    cy.requiredBatch("0212722157").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("0.940");
    cy.collectedBatchCount().should("have.text", "3/4");
    cy.wait(300);
    cy.inputFormButton().verifyAndClick();
    cy.inputFormButton().should("have.text", "Complete");
    cy.inputFormButton().should("be.disabled");

    cy.input("batch").type("0212722158");
    cy.requiredBatch("0212722158").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("4.850");
    cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
    cy.collectedBatchCount().should("have.text", "4/4");
    cy.wait(300);
    cy.inputFormButton().should("have.text", "Complete");
    cy.inputFormButton().verifyAndClick();
    cy.inputForm().should("not.exist");


    // Complete
    cy.orderMenuButton().verifyAndClick();
    cy.orderMenuComplete().verifyAndClick();

    // An issue with checking this. Will look into it.
    //  cy.operationsNameLast().should('have.text', 'Closing')

    cy.inputForm().should("exist");
    cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
    cy.input("quantity").should("have.class", INVALID_TEXT_FIELD);
    cy.input("TSW").should("not.have.class", INVALID_TEXT_FIELD);
    cy.input("moisture").should("not.have.class", INVALID_TEXT_FIELD);
    cy.requiredBatch("0212722155").should("have.text", "0212722155");
    cy.requiredBatch("0212722156").should("have.text", "0212722156");
    cy.requiredBatch("0212722157").should("have.text", "0212722157");
    cy.requiredBatch("0212722158").should("have.text", "0212722158");
    
    cy.collectedBatchCount().should("have.text", "0/4");
    cy.defaultUom().should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "MK");
    cy.uomList('quantity').should("contain.text", "LB");
    cy.uomList('quantity').should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KPS");
    cy.inputFormButton().should("have.text", "Save");
    cy.inputFormButton().should("be.disabled");

    cy.input("batch").type("0212722155");
    cy.requiredBatch("0212722155").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("1.935");
    cy.input("TSW").type("1.958");
    cy.input("moisture").type("6.10");
    cy.collectedBatchCount().should("have.text", "1/4");
    cy.wait(300);
    cy.inputFormButton().verifyAndClick();

    cy.input("batch").type("0212722156");
    cy.requiredBatch("0212722156").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("7.450");
    cy.input("TSW").type("2.349");
    cy.input("moisture").type("6.10");
    cy.collectedBatchCount().should("have.text", "2/4");
    cy.wait(300);
    cy.inputFormButton().verifyAndClick();

    cy.input("batch").type("0212722157");
    cy.requiredBatch("0212722157").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("0.940");
    cy.input("TSW").type("2.749");
    cy.input("moisture").type("6.10");
    cy.collectedBatchCount().should("have.text", "3/4");
    cy.wait(300);
    cy.inputFormButton().verifyAndClick();
    cy.inputFormButton().should("have.text", "Complete Order");
    cy.inputFormButton().should("be.disabled");

    cy.input("batch").type("0212722158");
    cy.requiredBatch("0212722158").should("have.class", SCANNED_BATCH_CLASS);
    cy.input("quantity").type("4.850");
    cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
    cy.collectedBatchCount().should("have.text", "4/4");
    cy.inputFormButton().verifyAndClick();
    cy.orderState().should("have.text", "Complete");
  });
});
