describe("providers tests", () => {
    it("returns the list of providers", () => {
        cy.request("http://localhost:8082/api/providers").then((response) => {
            expect(response.body).to.include.members(["sophtron", "mx", "finicity", "akoya"])
            expect(response.body.length).to.eq(4)
        });
    })
})