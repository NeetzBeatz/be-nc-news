const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`).then((topics) => {
        return topics;
    });
};

exports.fetchArticleById = (article_id, numComments) => {

    let sqlString = `SELECT
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.body,
            articles.created_at,
            articles.votes,
            articles.article_img_url, `

    sqlString += `COUNT(comments.article_id) AS comment_count `

    sqlString += `FROM articles `
    
    sqlString += `LEFT JOIN comments 
            ON comments.article_id = articles.article_id `

    sqlString += `WHERE articles.article_id=$1 `

    sqlString += `GROUP BY articles.article_id;`

    return db.query(sqlString, [article_id]).then(({rows})=> {
        if(rows.length === 0){
            return Promise.reject({
                status : 404,
                msg : `no article found with an article_id of ${article_id}`
            })
        }
        rows.forEach((article) => {
            article.comment_count = Number(article.comment_count)
        })
        return rows[0]
    })
}

exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {
    const validSortBys = ["article_id", "title", "topic", "author", "created_at", "votes", "comment_count"];

    const validOrderBys = ["asc", "desc"];

    if((!validSortBys.includes(sort_by)) || (!validOrderBys.includes(order))) {
        return Promise.reject({
            status : 400,
            msg : "bad request"
        });
    };

    let sqlString = `
        SELECT 
            articles.author,
            articles.title,
            articles.article_id,
            articles.topic,
            articles.created_at,
            articles.votes,
            articles.article_img_url,
            COUNT(comments.comment_id) AS comment_count
        FROM
            articles
        LEFT JOIN 
            comments ON articles.article_id = comments.article_id
        `
        const queryAllTopics = []

        if(topic) {
            sqlString += `WHERE topic = $1`
            queryAllTopics.push(topic)
        }

        sqlString += `GROUP BY
            articles.article_id ORDER BY articles.${sort_by} ${order}`
        
        return db.query(sqlString, queryAllTopics)
        .then((result) => {
            result.rows.forEach((article) => {
                article.comment_count = Number(article.comment_count)
            })
            return result.rows;
        });
};

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT * FROM comments 
        WHERE
            article_id=$1
        ORDER BY
            created_at DESC;`,
        [article_id]
        )
            .then((result) => {             
        return result.rows;
    });
};

exports.joinCommentToArticle = (article_id, username, body) => {
    const sqlQuery = 'INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;'

            return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id]).then(({rows})=> {
                if(rows.length === 0){
                    return Promise.reject({
                        status : 404,
                        msg : `no article found with an article_id of ${article_id}`
                    })
                }
                return rows[0]
            }).then(() => {
            return db.query(sqlQuery, [article_id, username, body])
        }).then(({rows}) => {
            return rows[0]
        })
};

exports.updateVotes = (patchRequestVotes, article_id) => {
    return this.fetchArticleById(article_id).then(() => {
        return db.query(`UPDATE articles SET votes = votes +$1 WHERE article_id = $2 RETURNING *;`, [patchRequestVotes, article_id]).then(({rows})=> {
            return rows[0]
        })
    })
};


exports.deleteCommentByCommentId = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id]).then(({rows})=> {
        if(rows.length === 0){
            return Promise.reject({
                status : 404,
                msg : `no article found with a comment_id of ${comment_id}`
            })
        }
        return rows[0]
    }).then(() => {

        return db.query(`DELETE FROM comments
            WHERE comment_id=$1;`, [comment_id])
    })
};

exports.fetchAllUsers = (request, response, next) => {
    return db.query(`SELECT * FROM users`).then((users) => {
        return users;
    });
};




