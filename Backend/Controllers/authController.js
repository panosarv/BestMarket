import pg from 'pg';
const { Pool } = pg;
import config from '../Config/dbConfig.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret  from '../Config/authConfig.js';

const pool = new Pool(config);

const signup = (req, res) => {
    const { username, password, email } = req.body;

    pool.query(
        'INSERT INTO bm_user (username, password, email) VALUES ($1, $2, $3) RETURNING *',
        [username, bcrypt.hashSync(password, 8), email],
        (err, results) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            res.send({ message: "User was registered successfully!" });
        }
    );
};

const signin = (req, res) => {
    const { username, password } = req.body;

    pool.query(
        'SELECT * FROM bm_user WHERE username = $1',
        [username],
        (err, results) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            const user = results.rows[0];

            if (!user) {
                return res.status(404).send({ message: "User not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accesstoken: null,
                    message: "Invalid password!"
                });
            }

            var token = jwt.sign({ id: user.id }, secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                accesstoken: token
            });
        }
    );
};

export default {signin, signup};