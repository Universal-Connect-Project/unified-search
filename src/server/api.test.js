const { getProviders } = require("./apiHandlers")

describe("Providers API", () => {
  describe("getProviders", () => {
    it("Returns a list of providers",  () => {
      const res = {
        send: jest.fn()
      }
      expect(getProviders(null, res))
      expect(res.send).toHaveBeenCalledWith(['sophtron', 'mx', 'finicity', 'akoya'])
    })
  })
})
