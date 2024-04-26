const { server} = require('./src/test/testServer')

jest.mock("./src/infra/logger")

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())