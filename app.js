const express = require("express");
const {getTopics} = require("./controllers/controllers");

const app = express();

app.get("/api/topics", getTopics)



app.all("*", (request, response, next) => {
    response.status(404).send({    
        message : "endpoint not found"
    })
})


// Error handling middleware

// app.use((err, request, response, next) =>{

// });




module.exports = app;