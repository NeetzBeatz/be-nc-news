const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const endpoints = require("../endpoints.json")

beforeEach(() => {
    return seed(data)
});

afterAll(() => db.end());

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

        describe("/api", () => {
            test("responds with an object containing all available endpoints", () => {
                return request(app)
                .get("/api")
                .expect(200)
                .then(({body}) => {
                    console.log(body.endpoints)
                    expect(body.endpoints).toEqual(endpoints)
                })
            })
        })



    })


})