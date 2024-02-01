import pg from 'pg';
const { Pool } = pg;
import config from '../Config/dbConfig.js';
import e from 'express';

const pool = new Pool(config);

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    pool.query(
        'SELECT * FROM bm_user WHERE username = $1',
        [req.body.username],
        (err, results) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (results.rowCount > 0) {
                res.status(400).send({ message: "Username is already in use!" });
                return;
            }

            pool.query(
                'SELECT * FROM bm_user WHERE email = $1',
                [req.body.email],
                (err, results) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    if (results.rowCount > 0) {
                        res.status(400).send({ message: "Email is already in use!" });
                        return;
                    }

                    next();
                }
            );
        }
    );
};

export default checkDuplicateUsernameOrEmail;
