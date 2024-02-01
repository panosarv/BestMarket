import pg from 'pg';
const { Pool } = pg;
import config from '../Config/dbConfig.js';

const pool = new Pool(config);

exports.findByUsername = (username) => {
    return pool.query('SELECT * FROM bm_user WHERE username = $1', [username]);
};

exports.save = (user) => {
    return pool.query('INSERT INTO bm_user (username, password, email) VALUES ($1, $2, $3) RETURNING *', [user.username, user.password, user.email]);
};
