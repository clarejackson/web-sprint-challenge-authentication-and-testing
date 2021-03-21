// Write your tests here
const supertest = require('supertest');
const server = require('./server');

test('sanity', () => {
  expect(true).not.toBe(false)
})

describe("users integration tests", () => {
  describe("/api/auth/register", () => {
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
   it("returns correct json error message", async () => {
     const res = await supertest(server)
     .post("/api/auth/register")
     .send({
       username: "",
       password: "jackson"
     })
     expect(res.statusCode).toBe(409)
     expect(res.body.message).toBe("username and password required")

   })
  })
})

