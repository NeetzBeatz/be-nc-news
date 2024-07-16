const db = require("../db/connection");

exports.fetchTopics = (request, response, next) => {
    return db.query(`SELECT * FROM topics`).then((topics) => {
        return topics;
    });
};

exports.fetchArticleByID = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({rows})=> {
        if(rows.length === 0){
            return Promise.reject({
                status : 404,
                msg : `no article found with an article_id of ${article_id}`
            })
        }
        return rows[0]
    })
}


