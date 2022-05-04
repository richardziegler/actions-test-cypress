const { describe, it } = require("mocha");

import { testDecodingWorkflow } from '../../support/workflows/decoding.js';

describe("Perform Decoding operation on PO", () => {
      
     it("Decoding", function(){
        const order = {processOrder: "104314351", inputMaterialUom: "KG"};
        cy.task("loadTestData", {table: "JB_TEST1", dataToLoadFile: "./cypress/data/tst_104314351.json"});
        cy.gotoOrder(order.processOrder);
        cy.clickTab("Tasks");
        testDecodingWorkflow("Decoding", "MANUAL DECODING", order, {number: "0180750035", quantity: "20"});
        cy.task("deleteTestData", {table: "JB_TEST1", dataToDeleteFile: "./cypress/data/tst_104314351_del.json"});
     });
});



