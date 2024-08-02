# ItsTheNews API

## Introduction

Welcome to my Project!

This API for news articles has been built in JavaScript for the purpose of accessing application data programmatically.

The intention here was to mimic the building of a real world backend service (such as Reddit) which should provide information to the front end architecture.

## Here is a link to the hosted version of this API: [Its the News](https://itsthenews.onrender.com/api)

-  The link will take you to a page with a list of all of the available endpoints on this API.

## Instructions

Minimum versions of Node.js, and Postgres needed to run the project:

-  `"node": "^18.20.4"`
-  `"pg": "^8.12.0"`

1. Start off by cloning the repository to your local database. To do this: open your terminal and `cd` into your prefered directory. Then do the following:

   -  run the command `git clone https://github.com/NeetzBeatz/be-nc-news.git`

   -  `cd` into this newly cloned repository
   -  Open the repository in your [VS Code](https://code.visualstudio.com/) software

      -  you can use the command: `code .` as a shortcut to open the repository in [VS Code](https://code.visualstudio.com/) from your terminal

2. In VS Code, create the necessary environment variables to run this project locally. Create 2 files called `.env.test `and `.env.development` and add the text as written into each file:

   -  add the following into the.env.test file: `PGDATABASE=nc_news_test`
   -  add the following into the .env.development file `PGDATABASE=nc_news`

3. Double check that these ".env" files are listed in the .gitignore file.

4. Run `npm install` in the [VS Code](https://code.visualstudio.com/) terminal.

## Running the Test Suite

To run the test suite, use the command `npm test`

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
