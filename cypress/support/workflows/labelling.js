
const SCANNED_BATCH_CLASS = 'text-blue-700';
const ALL_BATCHES_SCANNED_CLASS = 'bg-green-100';
const INVALID_TEXT_FIELD = "mdc-text-field--invalid";

export function testLabellingWorkflow(operation, equipment){

         //should addOperation be prefixed with 'test' since it does more than other simpler commands??
         //Not sure about this no operation version--what if the equipment mapping changes
         //also operation parameter is now unused
         //cy.addOperation(equipment, operation);
        cy.addOperation(equipment);
            cy.orderState().should("have.text", "In Progress");

        cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
            cy.wait(1000);
            cy.lastOperation().shouldBeStarted(); 

        cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
            cy.wait(1000);
            cy.lastOperation().shouldBeCompleted();
}