const http = require("../infra/http");
const { AnalyticsServiceEndpoint } = require("./config");

describe("Default API", () => {
  describe("Ping", () => {
    it("Pings api", async () => {
      const res = await http.get(`${AnalyticsServiceEndpoint}ping`)
      expect(res).toEqual({})
    })
  })
})
