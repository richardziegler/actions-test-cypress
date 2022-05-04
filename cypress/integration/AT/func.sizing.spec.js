const { describe, it } = require("mocha");

import { testSizingWorkflow } from '../../support/workflows/sizing.js';

describe("Perform Decoding operation on PO", () => {
      
     it("Sizing", function(){
        const order = {processOrder: '104342662', outputMaterialUom: 'KG', inputMaterialUom: 'KCS'};
        cy.task("loadTestData", {table: "RZ_TEST1", dataToLoadFile: "./cypress/data/tst_104342662.json"});
        cy.gotoOrder(order.processOrder);
        cy.clickTab("Tasks");
        testSizingWorkflow(
          "Cleaning",
          "Zeefmachine-88",
          order,
          [{ number: "0212670360", quantity: "10.32" }],
          [{number: '0212722155', quantity: '1.935'}, {number: '0212722156', quantity: '7.450'}, {number: '0212722157', quantity: '0.940'}, {number: '0212722158', quantity: '4.850'}]
        );
        cy.task("deleteTestData", {table: "RZ_TEST1", dataToDeleteFile: "./cypress/data/tst_104342662_del.json"});
     });
});
