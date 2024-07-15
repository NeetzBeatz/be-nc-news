const db = require("../db/connection");

exports.fetchTopics = (request, response, next) => {
    return db.query(`SELECT * FROM topics`).then((topics) => {
        return topics;
    });
};