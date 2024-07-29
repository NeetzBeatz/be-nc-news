const {fetchTopics, fetchArticleById, fetchAllArticles, selectCommentsByArticleId, joinCommentToArticle, updateVotes, deleteCommentByCommentId, fetchAllUsers} = require("../models/models");
const endpoints = require("../endpoints.json");
const { checkForTopic } = require("../db/seeds/utils");

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
    return fetchArticleById(article_id).then((article) => {
        response.status(200).send({article : article})
    })
    .catch((err) => {
        next(err);
    });
};

exports.getAllArticles = (request, response, next) => {
    const {sort_by, order, topic} = request.query
    Promise.resolve().then(() => {
        if (topic){
            return checkForTopic(topic)
        }
    })
    .then(() => {
        return fetchAllArticles(sort_by, order, topic)
    }).then((articles) => {
        return response.send({articles : articles})
    }).catch((err) => {
        next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
    const {article_id} = request.params
    const articlePromise = fetchArticleById(article_id)
    const commentPromise = selectCommentsByArticleId(article_id)
    
    Promise.all([articlePromise, commentPromise])
    .then(([article, comments]) => {
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

exports.incrementVotes = (request, response, next) => {
    const {article_id} = request.params
    const patchRequestVotes = request.body.inc_votes

        return updateVotes(patchRequestVotes, article_id).then((article) => {
            response.status(200).send({article : article})
        }).catch((err) => {
            next(err);
        });
}

exports.removeCommentByCommentId = (request, response, next) => {
    const {comment_id} = request.params

    return deleteCommentByCommentId(comment_id).then(() => {
        response.status(204).send()
    }).catch((err) => {
        next(err)
    });
};

exports.getAllUsers  = (request, response, next) => {
    fetchAllUsers().then((users) => {
        response.status(200).send({users : users})
    }).catch((err) => {
        next(err)
    });
};
