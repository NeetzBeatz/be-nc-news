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
            const {msg} = body;
            expect(msg).toBe("endpoint not found")
        })
    })
})

describe("TOPICS", () =>{
    describe("GET", () => {
        describe("/api/topics", () => {
            test("NOT PASSING should respond with status code 200 and an array of topic objects with keys of 'slug' and 'description'", () => {
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

describe("/api", () => {
        describe("GET", () => {
        test("responds with an object containing all available endpoints", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            })
        })
    })
})


describe("/api/articles/:article_id", () => {
    describe("GET", () => {
        describe("Status 200", () => {
                test("responds with an article object when given a valid article_id. The object should have properties of: author, title, article_id, body, topic, created_at, votes and article_img_url", () => {
                    return request(app)
                    .get("/api/articles/1")
                    .expect(200)
                    .then((response) => {
                        expect(response.body.article).toEqual({
                            article_id: 1,
                            title: 'Living in the shadow of a great man',
                            topic: 'mitch',
                            author: 'butter_bridge',
                            body: 'I find this existence challenging',
                            created_at: '2020-07-09T20:11:00.000Z',
                            votes: 100,
                            article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                        })
                    })
                })
            })

        describe("Error handling", () => {
            test("returns status code 400 when given an invalid article_id", () => {
                return request(app)
                .get("/api/articles/number-one-as-a-string")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("bad request")
                })
            })
                    
            test("returns status code 404 when given an article_id of the right data type that doesnt exist", () => {
                return request(app)
                .get("/api/articles/99")
                .expect(404)
                .then(({body}) => {
                    expect(body.msg).toBe("no article found with an article_id of 99")
                })
            })
        })
    })
})