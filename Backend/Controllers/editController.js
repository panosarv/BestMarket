import pg from 'pg';
const config = require("../Config/authConfig.js");
const bcrypt = require("bcryptjs");
const { Pool } = pg;
const pool = new Pool(config);
exports.editUsername = (req, res) => {
 pool.query(
    'SELECT * FROM bm_user WHERE username = $1',
    [req.body.username],
    (err, results) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (results.rows.length > 0) {
        return res
          .status(404)
          .send({ message: "Failed! Username is already in use!" });
      }

      pool.query(
        'UPDATE bm_user SET username = $1 WHERE id = $2',
        [req.body.username, req.body.id],
        (err, results) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          return res.send({ message: "Your username has been updated!" });
        }
      );
    }
 );
};

exports.editPassword = (req, res) => {
 pool.query(
    'UPDATE bm_user SET password = $1 WHERE id = $2',
    [bcrypt.hashSync(req.body.password, 8), req.body.id],
    (err, results) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      return res.send({ message: "Your password has been updated!" });
    }
 );
};