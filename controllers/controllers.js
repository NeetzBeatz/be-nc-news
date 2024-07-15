const {fetchTopics} = require("../models/models");

exports.getTopics = (request, response, next) => {
    fetchTopics().then((topics) => {
        response.status(200).send({topics : topics})
    }).catch((err) => {
        next(err)
    });
};