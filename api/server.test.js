// Write your tests here
const supertest = require('supertest');
const server = require('./server');

test('sanity', () => {
  expect(true).toBe(false)
})

describe("users integration tests", () => {
  it("creates a new user", async () => {
    const res = await supertest(server)
    .post("/api/auth/register")
    .send({
      username: "clare",
      password: "jackson"
    })
    expect(res.statusCode).toBe(201)
    expect(res.type).toBe("application/json")
    expect(res.body.id).toBeDefined()
    expect(res.body.username).toBe("clare")
  })
  
})

