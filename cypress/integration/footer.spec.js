describe('Footer', () => {
    context('with a single todo', () => {
        it('displays a singular todo in count', () => {
            cy.seedAndVisit([{id: 1, name: 'Buy Milk', isComplete: false}])
            cy.get('.todo-count')
            .should('contain', '1 todo left')
        })
    })

    context('with multiple todos', () => {
        beforeEach(() => {
            cy.seedAndVisit()
        })

        it('displays plural todos', () => {
            cy.get('.todo-count')
            .should('contain', '3 todos left')
        })

        // it('Filters active todos', () => {
        //     cy.contains('Active')
        //     .click()

        //     cy.get('.todo-list li')
        //     .should('have.length', 3)
        // })
        // it.only('Filters completed todos', () => {
        //     cy.contains('Completed')
        //     .click()

        //     cy.get('.todo-list li')
        //     .should('have.length', 1)
        // })

        it.only('Filters list correctly', () => {
            const filters = [{link: 'Active', expectedLength: 3}, {link: 'Completed', expectedLength: 1}, {link: 'All', expectedLength: 4}]

            cy.wrap(filters)
            .each(filter => {
                cy.contains(filter.link)
                .click()
    
                cy.get('.todo-list li')
                .should('have.length', filter.expectedLength)
            })
        })
    })
})