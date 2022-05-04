const { describe, it } = require("mocha");
const dayjs = require("dayjs");

import { testBlendingWorkflow } from '../../support/workflows/blending.js';

describe("Perform Blending operation on PO", () => {
    
     it('Blend', function(){
        const order = {processOrder: "104348221",  outputMaterialUom: "KG", inputMaterialUom: "KG"};
        cy.task("loadTestData", {table: "JB_TEST1", dataToLoadFile: "./cypress/data/tst_104348221.json"});
        cy.gotoOrder(order.processOrder);
        cy.clickTab("Tasks");
        testBlendingWorkflow("Blending", "Mixer-162", order, 
                            [{number: "0211729575", quantity: "20"}, 
                             {number: "0211905602", quantity: "20"}], 
                            {number: "0212815648", quantity: "40"});
        cy.task("deleteTestData", {table: "JB_TEST1", dataToDeleteFile: "./cypress/data/tst_104348221_del.json"});

     });

});

