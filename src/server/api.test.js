const { providersData } = require("../test/testData/api")
const { AnalyticsServiceEndpoint } = require("../server/config")
const http = require("../infra/http");

describe("Providers API", () => {
  describe("getProviders", () => {
    it("Returns a list of providers", async () => {
      expect(await http.get(`${AnalyticsServiceEndpoint}api/providers`)).toEqual({values: providersData.values})
    })
  })
})
