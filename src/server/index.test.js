const { handlePing } = require("./apiHandlers");

describe("Default API", () => {
  describe("handlePing", () => {
    it("responses with 200", () => {
      const res = {
        sendStatus: jest.fn()
      }

      expect(handlePing(null, res))
      expect(res.sendStatus).toHaveBeenCalledWith(200)
    })
  })
})
