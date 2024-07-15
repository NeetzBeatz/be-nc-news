const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed")

beforeEach(() => {
    return seed(data)
});

afterAll(() => db.end());

/*
Tests:

    - isArray() check that an array is returned

    - Should respond with status code 200 and an array of topic objects'

    - should respond with status code 200 and an array of topic objects with keys of 'slug' and 'description'

Error tests:

    - catch all bad URLs
    
*/

describe("All bad URLs", () => {
    test("All methods 404: responds with an error for an endpoint not found", () => {
        return request(app)
        .get("/api/notAnEnpoint")
        .expect(404)
        .then(({body}) => {
            const {message} = body;
            expect(message).toBe("endpoint not found")
        })
    })
})

describe("Topics", () =>{
    describe("GET", () => {
        describe("/api/topics", () => {
            test("should respond with status code 200 and an array of topic objects with keys of 'slug' and 'description'", () => {
                return request(app)
                .get("/api/topics")
                .expect(200)
                .then((response) => {
                    const responseData = response.body.topics.rows
                    expect(Array.isArray(responseData)).toBe(true)
                    expect(response.body.topics.rows.length).toBe(3)
                    expect(response.body.topics.rows[0]).toHaveProperty("slug")
                    expect(response.body.topics.rows[0]).toHaveProperty("description")
                })
            });

        })
    })
})