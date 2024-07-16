const {fetchTopics, fetchArticlesByID} = require("../models/models");
const endpoints = require("../endpoints.json")

exports.getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics : topics})
    }).catch((err) => {
        next(err)
    });
};

exports.getEndpoints = (request, response, next) => {
        return response.status(200).send({endpoints : endpoints});
};

