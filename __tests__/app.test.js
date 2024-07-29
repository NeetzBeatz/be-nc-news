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


describe("GET", () =>{

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


    describe("/api", () => {
        test("responds with an object containing all available endpoints", () => {
            return request(app)
            .get("/api")
            .expect(200)
            .then(({body}) => {
                expect(body.endpoints).toEqual(endpoints)
            })
        })
    })


    describe("TOPICS", () => {
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


    describe("ARTICLE ID", () => {
        describe("/api/articles/:article_id", () => {
            describe("status 200", () => {
                    test("responds with an article object when given a valid article_id. The object should now include comment count as an additional property", () => {
                        return request(app)
                        .get("/api/articles/1")
                        .expect(200)
                        .then((response) => {
                            expect(response.body.article).toMatchObject({
                                article_id: expect.any(Number),
                                title: expect.any(String),
                                topic: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                article_img_url: expect.any(String),
                                comment_count: expect.any(Number)
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


    describe("ARTICLES", () => {
        describe("/api/articles", () => {
            describe("status 200", () => {
                test("responds with an articles array of article objects containing all of the correct values: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
                    return request(app)
                    .get("/api/articles")
                    .expect(200)
                    .then(({body}) => {
                        const responseData = body.articles
                            responseData.forEach((article) => {
                                expect(typeof responseData).toBe("object");
                                expect(article).not.toHaveProperty("body");
                                expect(article).toMatchObject({
                                    article_id: expect.any(Number),
                                    title: expect.any(String),
                                    topic: expect.any(String),
                                    author: expect.any(String),
                                    created_at: expect.any(String),
                                    votes: expect.any(Number),
                                    article_img_url: expect.any(String),
                                    comment_count: expect.any(Number)
                                });
                                expect(responseData).toBeSortedBy("created_at", {descending : true})
                                expect(responseData.length).toBe(13)
                            });
                    });
                });
            });
        });

        describe("/api/articles?sort_by=topic", () => {
            test("responds with the articles ordered by the given topic", () => {
                return request(app)
                .get("/api/articles?sort_by=topic")
                .expect(200)
                .then((response)=> {
                    const body = response.body.articles
                    expect(body).toBeSortedBy("topic", {descending: true})
                    expect(Array.isArray(body)).toBe(true)
                })
            })

            test("responds with the array of article objects when no topic is given", () => {
                return request(app)
                .get("/api/articles?topic=")
                .expect(200)
                .then((response)=> {
                    const body = response.body.articles
                    expect(Array.isArray(body)).toBe(true)
                })
            })

            test("status 404 - when a topic of the right data type doesnt exist", () => {
                return request(app)
                .get("/api/articles?topic=topicNotFound")
                .expect(404)
                .then((response)=> {
                    const body = response.body.articles
                    expect(response.body.msg).toBe("no topicNotFound topic found")
                })
            })            
        })

        describe("/api/articles?order=asc", () => {
            test("responds with the articles ordered by the given order", () => {
                return request(app)
                .get("/api/articles?order=asc")
                .expect(200)
                .then((response)=> {
                        expect(response.body.articles).toBeSortedBy("created_at", {ascending: true})
                        expect(response.body.articles).not.toHaveProperty("body")
                })                
            })

            test("status 400 - invalid order given", () => {
                return request(app)
                .get("/api/articles?order=invalid")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("bad request")
                })
            });
        })

        describe("/api/articles sorting queries", () => {
            test("responds with the articles sorted by the given column name - if valid", () => {
                return request(app)
                .get("/api/articles?sort_by=author")
                .expect(200)
                .then((response)=> {
                    expect(response.body.articles).toBeSortedBy("author", {descending: true})
                    expect(response.body.articles).not.toHaveProperty("body")
                })                    
            })

            test("status 400 - invalid sort_by given", () => {
                return request(app)
                .get("/api/articles?sort_by=invalid")
                .expect(400)
                .then(({body}) => {
                    expect(body.msg).toBe("bad request")
                })
            });
        })
    });


    describe("COMMENTS", () => {
        describe("/api/articles/:article_id/comments", () => {
            describe("status 200", () => {
                test("responds with an array of all comments for the given article sorted by date with the most recent comments first", () => {
                    return request(app)
                    .get("/api/articles/5/comments")
                    .expect(200)
                    .then(({body}) => {
                        const commentsWithArticleId5 = body.comments
                        expect(Array.isArray(commentsWithArticleId5)).toBe(true)
                        expect(commentsWithArticleId5).toBeSortedBy("created_at", {descending : true})
                        expect(commentsWithArticleId5).toMatchObject([   
                            {
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                article_id: expect.any(Number)
                            },
                            {
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                                article_id: expect.any(Number)
                            }
                        ]);
                    });
                });

                test("responds with an empty array when given a valid ID that has no associated comments", () => {
                    return request(app)
                    .get("/api/articles/2/comments")
                    .expect(200)
                    .then(({body}) => {
                        const comments = body.comments
                        expect(comments).toEqual([])
                    });
                });
            });

            describe("Error handling", () => {
                describe("status 400", () => {
                    test("invalid article_id given - incorrect data type", () => {
                        return request(app)
                        .get("/api/articles/not-a-number/comments")
                        .expect(400)
                        .then(({body}) => {
                            expect(body.msg).toBe("bad request")
                        })
                    });
                })

                describe("status 404", () => {
                    test("returns status code 404 when given an article_id of the right data type that doesnt exist", () => {
                        return request(app)
                        .get("/api/articles/99/comments")
                        .expect(404)
                        .then(({body}) => {
                            expect(body.msg).toBe("no article found with an article_id of 99")
                        })
                    });
                })

            })

        });
    });

    describe("USERS", () => {
        describe("/api/users", () => {
            test("should respond with status code 200 and an array of user objects with keys of 'username', 'name' and 'avatar_url'", () => {
                return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body}) => {
                    const responseData = body.users.rows
                    expect(typeof responseData).toBe("object");
                    expect(responseData.length).toBe(4);
                });
            });

        })
    })
});


describe("POST", () => {

    describe("COMMENTS", () => {
        describe("/api/articles/:article_id/comments", () => {
            describe("status 201", () => {
                test("responds with the comment associated with the given article_id", () => {
                    const newComment = {
                        username: 'butter_bridge',
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                    }
                    return request(app)
                    .post("/api/articles/4/comments")
                    .send(newComment)
                    .expect(201)
                    .then((response) => {
                        const comment = response.body.comment
                        expect(comment).toEqual({
                                comment_id: 19,
                                body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                                article_id: 4,
                                author: 'butter_bridge',
                                votes: expect.any(Number),
                                created_at: expect.any(String)
                        })
                    })
                });

                test("Ignores any additional properties that are not required", () => {

                    return request(app)
                    .post("/api/articles/4/comments")
                    .send({
                        username: 'butter_bridge',
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        favouriteFood: "pizza"
                    })
                    .expect(201)
                    .then((response) => {
                        const comment = response.body.comment
                        expect(comment).toEqual({
                            comment_id: 19,
                            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                            article_id: 4,
                            author: 'butter_bridge',
                            votes: expect.any(Number),
                            created_at: expect.any(String)
                        })
                    })
                });

            });

            describe("status 400", () => {
                test("Returns a 400 status code when the username or body does not have an input", () => {
                    return request(app)
                    .post("/api/articles/4/comments")
                    .send({
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                    })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("bad request")
                    })
                });

                test("Returns 400 status code when the article_id provided is not valid", () => {
                    return request(app)
                    .post("/api/articles/four/comments")
                    .send({
                        username: 'butter_bridge',
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                    })
                    .expect(400)
                    .then(({body}) => {
                        expect(body.msg).toBe("bad request")
                    })
                });

            });


            describe("status 404", () => {
                test("Returns 404 message when the article_id provided is valid but does not exist", () => {
                    return request(app)
                    .post("/api/articles/400/comments")
                    .send({
                        username: 'butter_bridge',
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
                    })
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe("no article found with an article_id of 400")
                    })
                });


                test("Returns a 404 status message when passed a username that is not valid", () => {

                    return request(app)
                    .post("/api/articles/4/comments")
                    .send({
                        username: 'rick sanchez',
                        body: "Wubba-lubba-dub-dub!"
                    })
                    .expect(404)
                    .then(({body}) => {
                        expect(body.msg).toBe("inputted username doesn't exist")
                    })
                });


            });


        });
    });

})


describe("PATCH", () => {

    describe("VOTES", () => {
        describe("/api/articles/:article_id", () => {
            describe("status 200", () => {
                test("updates the votes property in the given article by the value given in the request body", () => {
                    const newVote = {
                        inc_votes : 5
                    }
                    return request(app)
                    .patch("/api/articles/1")
                    .send(newVote)
                    .expect(200)
                    .then((response) => {
                        expect(response.body.article.votes).toBe(105)
                    })
                })
            })


            describe("Error handling", () => {
                describe("status 400", () => {
                    test("returns status code 400 when given an invalid article ID (incorrect data type)", () => {
                        const newVote = {
                            inc_votes : 5
                        }
                        return request(app)
                        .patch("/api/articles/number-one")
                        .send(newVote)
                        .expect(400)
                        .then(({body}) => {
                            expect(body.msg).toBe("bad request")
                        })

                    })

                    test("returns status code 400 when given an invalid inc_votes property (incorrect data type - not a number)", () => {
                        const newVote = {
                            inc_votes : "five"
                        }
                        return request(app)
                        .patch("/api/articles/1")
                        .send(newVote)
                        .expect(400)
                        .then((response) => {
                            expect(response.body.msg).toBe("bad request")
                        })

                    })

                })

                describe("status 404", () => {
                    test("returns status 404 when given a valid but non existent ID", () => {
                        const newVote = {
                            inc_votes : "five"
                        }
                        return request(app)
                        .patch("/api/articles/948")
                        .send(newVote)
                        .expect(404)
                        .then(({body}) => {
                            expect(body.msg).toBe("no article found with an article_id of 948")
                        })
                    })
                })


            })

        })
    })

})


describe("DELETE", () => {

    describe("COMMENTS", () => {
        describe("/api/comments/:comment_id", () => {

            describe("status 204", () => {
                test("responds with status 204 and no comment when the given comment (identified by provided comment_id) is deleted", () => {
                    return request(app)
                    .delete("/api/comments/5")
                    .expect(204)
                })
            })

            describe("Error handling", () => {
                describe("status 400", () => {
                    test("responds with status 400 when given an invalid comment_id", () => {
                        return request(app)
                        .delete("/api/comments/number-five")
                        .expect(400)
                        .then(({body}) => {
                            expect(body.msg).toBe("bad request")
                        })
                    })
                })
                describe("status 404", () => {
                    test("responds with status 404 when given a valid but non-existent comment_id", () => {
                        return request(app)
                        .delete("/api/comments/99")
                        .expect(404)
                        .then(({body}) => {
                            expect(body.msg).toBe("no article found with a comment_id of 99")
                        })
                    })
                })
            })
        })
    })
})