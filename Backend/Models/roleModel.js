import pg from 'pg';
const { Pool } = pg;
import config from '../Config/dbConfig.js';

const pool = new Pool(config);

exports.findByName = (name) => {
    return pool.query('SELECT * FROM roles WHERE name = $1', [name]);
};

exports.save = (role) => {
    return pool.query('INSERT INTO roles (name) VALUES ($1) RETURNING *', [role.name]);
};
