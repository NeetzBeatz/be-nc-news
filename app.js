const express = require("express");
const {getTopics, getEndpoints, getArticleByID, getAllArticles} = require("./controllers/controllers");

const app = express();

app.get("/api/topics", getTopics)

app.get("/api", getEndpoints)

app.get("/api/articles/:article_id", getArticleByID)

app.get("/api/articles", getAllArticles)




// To capture all bad URLs

app.all("*", (request, response, next) => {
    response.status(404).send({    
        msg : "endpoint not found"
    });
});


// Error handling middleware

app.use((err, request, response, next) => {
    if(err.code === "22P02"){
        response.status(400).send({msg : "bad request"})
    }
    else{ next(err) };
});

app.use((err, request, response, next) => {
    if(err.status && err.msg){
        response.status(err.status).send({msg : err.msg})
    }
    else{ next(err) };
})



module.exports = app;