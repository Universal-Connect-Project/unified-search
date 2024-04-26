const { auth } = require("./preference")
const { user } = require("../test/testData/user")
const { server } = require("../test/testServer")
const {http, HttpResponse} = require("msw");
const { AuthServiceEndpoint } = require("./config");

describe("preference api", () => {
  describe("auth", () => {
    it("returns a user",  async () => {
      const req = {
        headers: {
          authorization: "Bearer token"
        }
      }

      const respUser = await auth(req)
      expect(respUser).toEqual(user)
    })
    it("handle errors",  async () => {
      server.use(http.get(`${AuthServiceEndpoint}auth`,
        () => new HttpResponse(null, {
        status: 400
      })));

      const req = {
        headers: {
          authorization: "Bearer token"
        }
      }

      const resUser = await auth(req)
      expect(resUser).toEqual(undefined)
    })
  })
})
