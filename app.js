const express = require("express");
const {getTopics, getEndpoints, getArticlesByID} = require("./controllers/controllers");

const app = express();

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)




app.all("*", (request, response, next) => {
    response.status(404).send({    
        message : "endpoint not found"
    });
});







module.exports = app;