import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'bestmarket_user',
  host: 'dpg-cm4ccp0cmk4c73cj2ffg-a.frankfurt-postgres.render.com',
  database: 'bestmarket',
  password: 'x5orZW8qHOOgQMjXM6vsnMcgufl65Vni',
  port: 5432,
  ssl:true,
});

export async function createNewAccount(email, password,username) {
    const query = 'INSERT INTO bm_user (email, password,username) VALUES ($1, $2,$3) RETURNING *';
    return result.rows[0];
}

export async function getAccount(email,password) {
    const query = 'SELECT * FROM bm_user WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email], [password]);
    return result.rows[0];
}

export async function checkIfUserExists(email,password){
    const query = 'SELECT * FROM bm_user WHERE email = $1 AND password = $2';
    const result = await pool.query(query, [email], [password]);
    return result.rows[0];
}