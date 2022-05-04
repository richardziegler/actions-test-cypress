const { describe, it } = require("mocha");
const dayjs = require("dayjs");

import { testLabellingWorkflow } from '../../support/workflows/labelling.js';

describe("Perform Labelling operation on PO", () => {

     it('Labelling', function(){
        const order = {processOrder: "104345314"};
        cy.task('loadTestData', {table: "JB_TEST1", dataToLoadFile: "./cypress/data/tst_104345314.json"});
        cy.gotoOrder(order.processOrder);
        cy.clickTab("Tasks");
        testLabellingWorkflow('Labelling', 'MANUAL LABELLING', '104345314');
        cy.task('deleteTestData', {table: "JB_TEST1", dataToDeleteFile: "./cypress/data/tst_104345314_del.json"});
     });

});



