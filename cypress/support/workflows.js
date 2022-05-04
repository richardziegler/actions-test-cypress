const SCANNED_BATCH_CLASS = 'text-blue-700';
const ALL_BATCHES_SCANNED_CLASS = 'bg-green-100';

export function testBlendingWorkflow(operation, operationIndex, equipment, processOrder, inputBatches, outputBatch){

         cy.gotoOrder(processOrder)
         cy.clickTab('Tasks')

         //should addOperation be prefixed with 'test' since it does more than other simpler commands??
         cy.addOperation(equipment, operation)
            cy.orderStateShouldBe('In Progress')

        cy.startOperation(operationIndex, operation)
            cy.requiredBatchesShouldBe(inputBatches.map(batch => batch.number))
            cy.inputShouldHaveUoms('quantity', 'KG', ['KG','MK', 'LB', 'KCS', 'KPS'])
            cy.inputFormButtonShouldRead("Save")
            cy.inputFormButtonShouldBeDisabled()

        for (let [index, inputBatch] of inputBatches.entries()){
            cy.inputShouldBeRequired('batch')
            cy.inputShouldHaveFocus('batch')
            cy.inputShouldBeRequired('quantity')

            cy.enterInput('batch', inputBatch.number)
                cy.batchInRequiredBatchesShouldHaveClass(inputBatch.number, SCANNED_BATCH_CLASS);

            cy.enterInput('quantity', inputBatch.quantity)
                cy.collectedBatchCountShouldBe(`${index+1}/2`)

            
            //last input batch
            if (index === inputBatches.length + 1){
                cy.inputFormButtonShouldRead("Start")
                cy.requiredBatchesAreaShouldHaveClass(ALL_BATCHES_SCANNED_CLASS)
            }
            cy.clickInputFormButton()
              
        }
  
        cy.clickInputFormButton()
            cy.inputFormShouldBeDismissed()
            cy.operationShouldBeStarted(operationIndex, operation) 

        cy.stopOperation(operationIndex, operation)
            cy.inputFormShouldBeActivated()
            cy.inputShouldBeRequired('batch')
            cy.inputShouldHaveFocus('batch')
            cy.inputShouldBeRequired('quantity')
            cy.requiredBatchesShouldBe([outputBatch.number])
            cy.collectedBatchCountShouldBe('0/1')
            cy.inputShouldHaveUoms('quantity', 'KG', ['KG','MK', 'LB', 'KCS', 'KPS'])
            cy.inputFormButtonShouldRead("Complete")
            cy.inputFormButtonShouldBeDisabled()

        cy.enterInput('batch', outputBatch.number)
            cy.batchInRequiredBatchesShouldHaveClass(outputBatch.number, SCANNED_BATCH_CLASS)

        cy.enterInput('quantity', outputBatch.quantity)
            cy.collectedBatchCountShouldBe('1/1')
            cy.requiredBatchesAreaShouldHaveClass(ALL_BATCHES_SCANNED_CLASS)
            cy.inputFormButtonShouldBeEnabled()

        cy.clickInputFormButton()
            cy.inputFormShouldBeDismissed()
            cy.operationShouldBeCompleted()
}