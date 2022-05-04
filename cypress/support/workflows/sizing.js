const SCANNED_BATCH_CLASS = 'text-blue-700';
const ALL_BATCHES_SCANNED_CLASS = 'bg-green-100';
const INVALID_TEXT_FIELD = "mdc-text-field--invalid";

export function testSizingWorkflow(operation, equipment, order, inputBatches, outputBatches) {
    cy.addOperation(equipment, "Sizing");
    cy.orderState().should("have.text", "In Progress");
    cy.wait(2000)
    cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
    for (const batch of inputBatches){
        cy.requiredBatch(batch.number).should("have.text", batch.number); 
     }

     cy.collectedBatchCount().should("have.text", `0/${inputBatches.length}`);
     cy.defaultUom('quantity').should("contain.text", order.inputMaterialUom);
     cy.uomList('quantity').should("contain.text", "KG");
     cy.uomList('quantity').should("contain.text", "MK");
     cy.uomList('quantity').should("contain.text", "LB");
     cy.uomList('quantity').should("contain.text", "KCS");
     cy.uomList('quantity').should("contain.text", "KPS");
     cy.inputFormButton().should("have.text", "Start");
     cy.inputFormButton().should("be.disabled");

     for (let [index, inputBatch] of inputBatches.entries()){
        cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
        //todo! almost impossible to decouple structure from selection with mdc!
        cy.input("batch").children("input").should("have.focus");
        cy.input("quantity").should("have.class", INVALID_TEXT_FIELD);

        cy.input("batch").type(inputBatch.number);
            cy.requiredBatch(inputBatch.number).should("have.class", SCANNED_BATCH_CLASS);

        cy.input('quantity').type(inputBatch.quantity);
            cy.collectedBatchCount().should("have.text", `${index+1}/${inputBatches.length}`);

        //last input batch
        if (index === inputBatches.length + 1){
            cy.inputFormButton().should("have.text", "Start");
            cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
        }
        cy.inputFormButton().verifyAndClick();
    }

    cy.inputForm().should("not.exist");
    cy.wait(1000)
    cy.lastOperation().shouldBeStarted(); 
    cy.wait(3000);

    // *** Output Batches ***
    cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
    cy.inputForm().should("exist");
    cy.input("batch").children("input").should("have.focus");
    cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
    cy.input("quantity").should("not.have.class", INVALID_TEXT_FIELD);

    for (const batch of outputBatches) {
        cy.requiredBatch(batch.number).should("have.text", batch.number);
    }
    cy.collectedBatchCount().should("have.text", `0/${outputBatches.length}`);
    cy.defaultUom('quantity').should("contain.text", order.outputMaterialUom);
    cy.uomList('quantity').should("contain.text", "KG");
    cy.uomList('quantity').should("contain.text", "MK");
    cy.uomList('quantity').should("contain.text", "LB");
    cy.uomList('quantity').should("contain.text", "KCS");
    cy.uomList('quantity').should("contain.text", "KPS");
    cy.inputFormButton().should("have.text", "Save");
    cy.inputFormButton().should("be.disabled");


    for (let [index, outputBatch] of outputBatches.entries()){
        cy.input("batch").children("input").should("have.focus");
        cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
        cy.input("quantity").should("not.have.class", INVALID_TEXT_FIELD);

        cy.input("batch").type(outputBatch.number);
            cy.requiredBatch(outputBatch.number).should("have.class", SCANNED_BATCH_CLASS);

        cy.input('quantity').type(outputBatch.quantity);
            cy.collectedBatchCount().should("have.text", `${index+1}/${outputBatches.length}`);

        //last input batch
        if (index === outputBatches.length + 1){
            cy.inputFormButton().should("have.text", "Save");
            cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
        }
        cy.inputFormButton().verifyAndClick();
    }
    cy.inputForm().should("not.exist");
    cy.wait(1000);
    cy.lastOperation().shouldBeCompleted();
}


