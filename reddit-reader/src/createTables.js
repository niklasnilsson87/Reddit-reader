const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reddit-reader',
}).promise()

const createSubRedditTable = `
    CREATE TABLE subreddit (
        sub_id VARCHAR(16) PRIMARY KEY NOT NULL,
        sub_name VARCHAR(30) NOT NULL
    );`

const createContentTable = `
    CREATE TABLE content (
        body text NOT NULL,
        score int NOT NULL,
        name VARCHAR(30) PRIMARY KEY NOT NULL
    );`

const createCommentsTable = `
    CREATE TABLE comments (
        id VARCHAR(11) NOT NULL PRIMARY KEY,
        parent_id VARCHAR(16) NOT NULL,
        link_id VARCHAR(16) NOT NULL,
        name VARCHAR(30) NOT NULL,
        author VARCHAR(30) NOT NULL,
        created DATE NOT NULL,
        sub_id VARCHAR(16) NOT NULL,
        FOREIGN KEY (sub_id) REFERENCES subreddit (sub_id),
        FOREIGN KEY (name) REFERENCES content (name)
    );`

// const commentsTableWithoutConstrains = `
//     CREATE TABLE comments (
//         id VARCHAR(11),
//         parent_id VARCHAR(16),
//         link_id VARCHAR(16),
//         name VARCHAR(30),
//         author VARCHAR(30),
//         created DATE,
//         sub_id VARCHAR(16)
//     );`

// const contentTableWithoutConstrains = `
//     CREATE TABLE content (
//         body text,
//         score int,
//         name VARCHAR(30)
//     );`
// const subRedditTableWithoutConstrains = `
//     CREATE TABLE subreddit (
//         sub_id VARCHAR(16),
//         sub_name VARCHAR(30)
//     );`

const runQueries = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS comments;')
    await pool.query('DROP TABLE IF EXISTS content;')
    await pool.query('DROP TABLE IF EXISTS subreddit;')
    await pool.query(createSubRedditTable)
    await pool.query(createContentTable)
    await pool.query(createCommentsTable)
    // await pool.query(commentsTableWithoutConstrains)
    // await pool.query(contentTableWithoutConstrains)
    // await pool.query(subRedditTableWithoutConstrains)
  } catch (e) {
    console.log(e)
  }
}

runQueries()

module.exports = pool