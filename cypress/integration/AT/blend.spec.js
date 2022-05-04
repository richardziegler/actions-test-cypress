const { describe, it } = require("mocha");
const dayjs = require("dayjs")

describe("Perform Blending operation on PO", () => {
     it('Blend', function(){
         cy.visit("http://localhost:3001/ENK");
         cy.get('input[data-test="ord-search-field"]').type('104348221')
         cy.contains('Tasks').click()
         cy.get('button[data-test="ord-add-op-button"]').click()
         cy.focused().should('have.class', 'mdc-text-field__input')   
         cy.get('input[data-test="add-op-form-equip-field"]').type('Mixer-162')
         cy.get('button[data-test="add-op-form-save-button"]').contains('Save').click()
         cy.get('div[data-test="ord-state"]').contains('In Progress')
         cy.get('button[data-test="op-action"]').contains('Start').last().click()
         cy.get('input[data-test="input-form-batch-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.get('input[data-test="input-form-quantity-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0211729575').should('have.text', '0211729575')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0211905602').should('have.text', '0211905602')
         cy.get('div[data-test="input-form-batch-count"]').should('have.text', '0/2')
         cy.get('span[class="mdc-select__selected-text-container"]').contains('span', 'KG').should('have.text', 'KG')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KG')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'MK')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'LB')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KCS')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KPS')
         cy.get('button[data-test="input-form-button"]').should('be.disabled')
         cy.get('input[data-test="input-form-batch-field"]').type('0211729575')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0211729575').should('have.class', 'text-blue-700')
         cy.get('input[data-test="input-form-quantity-field"]').type('20')
         cy.get('div[data-test="input-form-batch-count"]').should('have.text', '1/2')
         cy.get('button[data-test="input-form-button"]').click()
         cy.get('input[data-test="input-form-batch-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.get('input[data-test="input-form-quantity-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.focused().should('have.attr', 'data-test', 'input-form-batch-field')
         cy.get('input[data-test="input-form-batch-field"]').type('0211905602')
         cy.get('input[data-test="input-form-quantity-field"]').type('20')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0211729575').should('have.class', 'text-green-800')
         cy.get('div[data-test="input-form-batch-count"]').should('have.text', '2/2')
         cy.get('button[data-test="input-form-button"]').click()
         cy.get('div[data-test="input-form"]').should('not.exist')
         cy.get('div[data-test="ord-state"]').should('have.class', 'text-yellow-500')
         cy.wait(1000)
         cy.get('span[data-test="op-start-time"]').last().should(($span => {
             const date = dayjs($span.text()).unix()
             const now = dayjs().unix()
             expect(date).to.be.closeTo(now, 30)
         }))
         cy.get('button[data-test="op-action"]').contains('Stop').last().click()
         cy.get('div[class="fixed inset-0 max-w-full flex justify-center bg-[rgba(0,0,0,0.4)]"]').should('exist')
         cy.focused().should('have.attr', 'data-test', 'input-form-batch-field')
         cy.get('input[data-test="input-form-batch-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.get('input[data-test="input-form-quantity-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.text', '0212815648')
         cy.get('button[data-test="input-form-button"]').should('be.disabled')
         cy.get('div[data-test="input-form-batch-count"]').should('have.text', '0/1')
         cy.get('span[class="mdc-select__selected-text-container"]').contains('span', 'KG').should('have.text', 'KG')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KG')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'MK')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'LB')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KCS')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KPS')
         cy.get('input[data-test="input-form-batch-field"]').type('0212815648')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.class', 'text-blue-700')
         cy.get('input[data-test="input-form-quantity-field"]').type('40')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.class', 'text-green-800')
         cy.get('div[data-test="input-form-batch-count"]').should('have.text', '1/1')
         cy.get('button[data-test="input-form-button"]').should('be.enabled')
         cy.get('button[data-test="input-form-button"]').click()
         cy.get('div[data-test="input-form"]').should('not.exist') 
         cy.get('svg[data-test="op-status-icon"]').should('have.class', 'text-green-700')
     })

     it('Drying', function() {
        cy.get('button[data-test="ord-add-op-button"]').click()
        cy.focused().should('have.class', 'mdc-text-field__input')   
        cy.get('input[data-test="add-op-form-equip-field"]').type('Roterende Droger-993')
        cy.get('button[type="submit"]').contains('Save').click()
        cy.get('div[class="leading-none text-xs pt-0.5 pl-1"]').should('have.text', 'Not Started')
        cy.get('button[data-test="op-action"]').contains('Start').last().click()
        cy.get('input[data-test="input-form-batch-field"]').parent().should('have.class', 'mdc-text-field--invalid')
        cy.get('input[data-test="input-form-quantity-field"]').parent().should('not.have.class', 'mdc-text-field--invalid')
        cy.focused().should('have.attr', 'data-test', 'input-form-batch-field')
        cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.text', '0212815648')
        cy.get('div[data-test="input-form-batch-count"]').should('have.text', '0/1')
        cy.get('span[class="mdc-select__selected-text-container"]').contains('span', 'KG').should('have.text', 'KG')
        cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KG')
        cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'MK')
        cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'LB')
        cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KCS')
        cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KPS')
        cy.get('button[data-test="input-form-button"]').should('be.disabled')
        cy.get('input[data-test="input-form-batch-field"]').type('0212815648')
        cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.class', 'text-green-800')
        cy.get('button[data-test="input-form-button"]').should('be.enabled')
        cy.get('div[data-test="input-form-batch-count"]').should('have.text', '1/1')
        cy.get('button[data-test="input-form-button"]').click()
        cy.get('div[data-test="input-form"]').should('not.exist')
        cy.get('div[data-test="ord-state"]').should('have.class', 'text-yellow-500')
        cy.wait(1000)
        cy.get('div[class="leading-none text-xs pt-0.5 pl-1"]').last().should(($span => {
            const date = dayjs($span.text()).unix()
            const now = dayjs().unix()
            expect(date).to.be.closeTo(now, 30)
        }))
        cy.get('button[data-test="op-action"]').contains('Stop').last().click()
        cy.get('div[class="fixed inset-0 max-w-full flex justify-center bg-[rgba(0,0,0,0.4)]"]').should('exist')
        cy.get('input[data-test="input-form-batch-field"]').parent().should('have.class', 'mdc-text-field--invalid')
        cy.get('input[data-test="input-form-quantity-field"]').parent().should('not.have.class', 'mdc-text-field--invalid')
        cy.focused().should('have.attr', 'data-test', 'input-form-batch-field')
        cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.text', '0212815648')
        cy.get('button[data-test="input-form-button"]').should('be.disabled')
        cy.get('div[data-test="input-form-batch-count"]').should('have.text', '0/1')
        cy.get('input[data-test="input-form-batch-field"]').type('0212815648')
        cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.class', 'text-green-800')
        cy.get('button[data-test="input-form-button"]').should('be.enabled')
        cy.get('button[data-test="input-form-button"]').click()
        cy.get('div[class="fixed inset-0 max-w-full flex justify-center bg-[rgba(0,0,0,0.4)]"]').should('not.exist') 
        cy.get('svg[data-test="op-status-icon"]').should('have.class', 'text-green-700')
    })

     it('Blending PO', function() {
         cy.get('button[data-test="ord-menu-button"]').click()
         cy.get('li[data-test="ord-menu-complete"]').contains('COMPLETE').click()
         cy.get('div[class="fixed inset-0 max-w-full flex justify-center bg-[rgba(0,0,0,0.4)]"]').should('exist')
         cy.get('input[data-test="input-form-batch-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.get('input[data-test="input-form-quantity-field"]').parent().should('have.class', 'mdc-text-field--invalid')
         cy.focused().should('have.attr', 'data-test', 'input-form-batch-field')
         cy.get('input[data-test="input-form-TSW-field"]').parent().should('not.have.class', 'mdc-text-field--invalid')
         cy.get('input[data-test="input-form-moisture-field"]').parent().should('not.have.class', 'mdc-text-field--invalid')
         cy.get('button[data-test="input-form-button"]').should('be.disabled')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.text', '0212815648')
         cy.get('div[data-test="input-form-batch-count"]').should('have.text', '0/1')
         cy.get('span[class="mdc-select__selected-text-container"]').contains('span', 'KG').should('have.text', 'KG')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KG')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'MK')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'LB')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KCS')
         cy.get('ul[class="lmnt mdc-list"]').children().should('contain.text', 'KPS')
         cy.get('input[data-test="input-form-batch-field"]').type('0212815648')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.class', 'text-blue-700')
         cy.get('input[data-test="input-form-quantity-field"]').type('35')
         cy.get('div[data-test="input-form-batch-count"]').should('have.text', '1/1')
         cy.get('div[data-test="input-form-batch-area"]').contains('div', '0212815648').should('have.class', 'text-green-800')
         cy.get('button[data-test="input-form-button"]').should('be.enabled')
         cy.get('button[data-test="input-form-button"]').click()
         cy.get('div[data-test="ord-state"]').contains('Complete').should('exist')
         cy.get('button[data-test="ord-add-op-button"]').should('be.disabled')
        })
})
