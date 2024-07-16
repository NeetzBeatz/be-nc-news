const {fetchTopics, fetchArticleByID} = require("../models/models");
const endpoints = require("../endpoints.json")

exports.getTopics  = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics : topics})
    }).catch((err) => {
        next(err)
    });
};

exports.getEndpoints = (request, response, next) => {
        return response.status(200).send({endpoints : endpoints});
};

exports.getArticleByID = (request, response, next) => {
    const {article_id} = request.params
        fetchArticleByID(article_id).then((article) => {
            response.status(200).send({article : article})
        })
        .catch((err) => {
            next(err);
        })
}

