const { describe, it } = require("mocha");
const dayjs = require("dayjs");

import { testTreatingWorkflow, testTreatingAfterTransformWorkflow } from '../../support/workflows/treating.js';

describe("Perform Treating operation on PO", () => {
    
     it('Treating', function(){
        const order = {processOrder: "104344885",  outputMaterialUom: "KG", inputMaterialUom: "KG"};
        cy.task("loadTestData", {table: "JB_TEST1", dataToLoadFile: "./cypress/data/tst_104344885.json"});
        cy.gotoOrder(order.processOrder);
        cy.clickTab("Tasks");
        testTreatingWorkflow("Treating", "TRT 1", order,
                             {number: "0183050479", quantity: "1.226"}, 
                            {number: "0212773428", quantity: "1.226"});
        cy.task('deleteTestData', {table: "JB_TEST1", dataToDeleteFile: "./cypress/data/tst_104344885_del.json"});
     });

     it('Treating After Transform', function(){
        const order = {processOrder: "104348221",  outputMaterialUom: "KG"};
        cy.task("loadTestData", {table: "JB_TEST1", dataToLoadFile: "./cypress/data/tst_104348221_post_blend.json"});
        cy.gotoOrder(order.processOrder);
        cy.clickTab("Tasks");
        testTreatingAfterTransformWorkflow("Treating", "TRT 1", order,
                            {number: "0212815648", quantity: "40"});
        cy.task('deleteTestData', {table: "JB_TEST1", dataToDeleteFile: "./cypress/data/tst_104348221_del.json"});
     });
});
