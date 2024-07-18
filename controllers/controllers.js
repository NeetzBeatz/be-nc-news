const {fetchTopics, fetchArticleById, fetchAllArticles, selectCommentsByArticleId, joinCommentToArticle} = require("../models/models");
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

exports.getArticleById = (request, response, next) => {
    const {article_id} = request.params
        fetchArticleById(article_id).then((article) => {
            response.status(200).send({article : article})
        }).catch((err) => {
            next(err);
        });
};

exports.getAllArticles = (request, response, next) => {
    fetchAllArticles().then((articles) => {
        response.status(200).send({articles : articles})
    }).catch((err) => {
        next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params
    return fetchArticleById(article_id)
    .then((article) => {
        const fetchedArticleId = article.article_id
        if (fetchedArticleId !== [])
    return selectCommentsByArticleId(article_id)
    }).then((comments) => {
        response.status(200).send({comments : comments})
    }).catch((err) => {
        next(err);
    });
};

exports.addCommentToArticle = (request, response, next) => {
    const {article_id} = request.params;
    const {username, body} = request.body;
        return joinCommentToArticle(article_id, username, body).then((comment) => { 
            response.status(201).send({comment : comment})
        }).catch((err) => {
            next(err);
        });
};