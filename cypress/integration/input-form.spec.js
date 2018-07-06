describe('Input form', () => {
    beforeEach(() => {
       cy.seedAndVisit([])
    })

    it('focuses input on load', () => {
        // cy.serveItUp([])
        cy.focused()
          .should('have.class', 'new-todo')
          // This .should method is considered an Assertion
    })

    it('accepts input', () => {
        const typed = 'Buy Milk'

        cy.get('.new-todo')
        .type(typed)
        .should('have.value', typed)
    })

    context('Form submission', () => {
        beforeEach(() => {
         cy.seedAndVisit([])
        })
        it('Adds a new todo on submit', () => {
            const itemText = "Buy eggs"
            cy.route('POST', '/api/todos', {
                name: itemText,
                id: 1,
                isComplete: false
            })

            cy.get('.new-todo')
            .type(itemText)
            .type(`{enter}`)
            .should('have.value', '')
            cy.get('.todo-list li')
                .should('have.length', 1)
                .and('contain', itemText)
        })

        it('Show an error mess on failed sumbission', () => {
            cy.route({
                url: '/api/todos',
                method: 'POST',
                status: 500,
                response: {}
            })

            cy.get('.new-todo')
            .type('test{enter}')

            cy.get('.todo-list li')
            .should('not.exist')

            cy.get('.error')
            .should('be.visible')
        })
    })
})