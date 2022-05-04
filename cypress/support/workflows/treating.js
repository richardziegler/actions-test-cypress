
const SCANNED_BATCH_CLASS = 'text-blue-700';
const ALL_BATCHES_SCANNED_CLASS = 'bg-green-100';
const INVALID_TEXT_FIELD = "mdc-text-field--invalid";

export function testTreatingWorkflow(operation, equipment, order, inputBatch, outputBatch){
        //leave capability to handle multiple input batches
        const inputBatches = [inputBatch];

         //should addOperation be prefixed with 'test' since it does more than other simpler commands??
         //Not sure about this no operation version--what if the equipment mapping changes
         //also operation parameter is now unused
         //cy.addOperation(equipment, operation);
        cy.addOperation(equipment);
            cy.orderState().should("have.text", "In Progress");

        cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
            for (const batch of inputBatches){
               cy.requiredBatch(batch.number).should("have.text", batch.number); 
            }
            cy.wait(2000);
            cy.defaultUom("quantity").should("contain.text", order.inputMaterialUom);
            cy.uomList("quantity").should("contain.text", "KG");
            cy.uomList("quantity").should("contain.text", "MK");
            cy.uomList("quantity").should("contain.text", "LB");
            cy.uomList("quantity").should("contain.text", "KCS");
            cy.uomList("quantity").should("contain.text", "KPS");
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
            cy.wait(1000);
            cy.lastOperation().shouldBeStarted(); 

        cy.wait(1000);  //waiting for button to switch
        cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
            cy.inputForm().should("exist");
            cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
            cy.input("batch").children("input").should("have.focus");
            cy.input("quantity").should("not.have.class", INVALID_TEXT_FIELD);
            cy.input("TSW").should("not.have.class", INVALID_TEXT_FIELD);
            cy.input("moisture").should("not.have.class", INVALID_TEXT_FIELD);

            cy.requiredBatch(outputBatch.number).should("have.text", outputBatch.number); 
            
            cy.collectedBatchCount().should("have.text", "0/1");

            cy.inputShouldHaveUoms('quantity', 'KG', ['KG','MK', 'LB', 'KCS', 'KPS']);
            //this commands selector is very strange
            cy.defaultUom("quantity", "KG").should("contain.text", order.outputMaterialUom);
            cy.uomList("quantity").should("contain.text", "KG");
            cy.uomList("quantity").should("contain.text", "MK");
            cy.uomList("quantity").should("contain.text", "LB");
            cy.uomList("quantity").should("contain.text", "KCS");
            cy.uomList("quantity").should("contain.text", "KPS");
            cy.inputFormButton().should("have.text", "Complete");
            cy.inputFormButton().should("be.disabled");

        cy.input('batch').type(outputBatch.number);
            cy.requiredBatch(outputBatch.number).should("have.class", SCANNED_BATCH_CLASS);

        cy.input('quantity').type(outputBatch.quantity);
            cy.collectedBatchCount().should("have.text", "1/1");
            cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
            cy.inputFormButton().should("be.enabled");

        cy.inputFormButton().verifyAndClick();
            cy.inputForm().should("not.exist");
            //todo! cy.operationShouldBeCompleted()
            cy.wait(1000);
            cy.lastOperation().shouldBeCompleted();
}
export function testTreatingAfterTransformWorkflow(operation, equipment, order, outputBatch){
        //leave capability to handle multiple starting batches
        const startingBatches = [outputBatch];

         //should addOperation be prefixed with 'test' since it does more than other simpler commands??
         //Not sure about this no operation version--what if the equipment mapping changes
         //also operation parameter is now unused
         //cy.addOperation(equipment, operation);
        cy.addOperation(equipment);
            cy.orderState().should("have.text", "In Progress");
        
        cy.wait(2000);

        cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
            for (const batch of startingBatches){
               cy.requiredBatch(batch.number).should("have.text", batch.number); 
            }
            cy.wait(2000);
            cy.defaultUom("quantity").should("contain.text", order.outputMaterialUom);
            cy.uomList("quantity").should("contain.text", "KG");
            cy.uomList("quantity").should("contain.text", "MK");
            cy.uomList("quantity").should("contain.text", "LB");
            cy.uomList("quantity").should("contain.text", "KCS");
            cy.uomList("quantity").should("contain.text", "KPS");
            cy.inputFormButton().should("have.text", "Start");
            cy.inputFormButton().should("be.disabled");

        for (let [index, startingBatch] of startingBatches.entries()){
            cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
            //todo! almost impossible to decouple structure from selection with mdc!
            cy.input("batch").children("input").should("have.focus");
            cy.input("quantity").should("have.class", INVALID_TEXT_FIELD);

            cy.input("batch").type(startingBatch.number);
                cy.requiredBatch(startingBatch.number).should("have.class", SCANNED_BATCH_CLASS);

            cy.input('quantity').type(startingBatch.quantity);
                cy.collectedBatchCount().should("have.text", `${index+1}/${startingBatches.length}`);

            //last input batch
            if (index === startingBatches.length + 1){
                cy.inputFormButton().should("have.text", "Start");
                cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
            }
            cy.inputFormButton().verifyAndClick();
              
        }
            cy.inputForm().should("not.exist");
            cy.wait(1000);
            cy.lastOperation().shouldBeStarted(); 

        cy.wait(1000);  //waiting for button to switch
        cy.lastOperation().find('button[data-test="op-action"]').verifyAndClick();
            cy.inputForm().should("exist");
            cy.input("batch").should("have.class", INVALID_TEXT_FIELD);
            cy.input("batch").children("input").should("have.focus");
            cy.input("quantity").should("not.have.class", INVALID_TEXT_FIELD);
            cy.input("TSW").should("not.have.class", INVALID_TEXT_FIELD);
            cy.input("moisture").should("not.have.class", INVALID_TEXT_FIELD);

            cy.requiredBatch(outputBatch.number).should("have.text", outputBatch.number); 
            
            cy.collectedBatchCount().should("have.text", "0/1");

            cy.inputShouldHaveUoms('quantity', 'KG', ['KG','MK', 'LB', 'KCS', 'KPS']);
            //this commands selector is very strange
            cy.defaultUom("quantity", "KG").should("contain.text", order.outputMaterialUom);
            cy.uomList("quantity").should("contain.text", "KG");
            cy.uomList("quantity").should("contain.text", "MK");
            cy.uomList("quantity").should("contain.text", "LB");
            cy.uomList("quantity").should("contain.text", "KCS");
            cy.uomList("quantity").should("contain.text", "KPS");
            cy.inputFormButton().should("have.text", "Complete");
            cy.inputFormButton().should("be.disabled");

        cy.input('batch').type(outputBatch.number);
            cy.requiredBatch(outputBatch.number).should("have.class", SCANNED_BATCH_CLASS);

        cy.input('quantity').type(outputBatch.quantity);
            cy.collectedBatchCount().should("have.text", "1/1");
            cy.requiredBatchesArea().should("have.class", ALL_BATCHES_SCANNED_CLASS);
            cy.inputFormButton().should("be.enabled");

        cy.inputFormButton().verifyAndClick();
            cy.inputForm().should("not.exist");
            //todo! cy.operationShouldBeCompleted()
            cy.wait(1000);
            cy.lastOperation().shouldBeCompleted();
}