// routes/router.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const db = require('../db/db.js');
const mysql = require('mysql');
const $sql = require('../db/sqlMap');
const userMiddleware = require('../middleware/users.js');
const jsonWrite = function(res, ret) {
  if(typeof ret === 'undefined') {
      res.json({
          code: '1',
          msg: 'operation failed'
      });
  } else {
      res.json(ret);
  }
};
var conn = mysql.createPool(db.mysql);
router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    conn.query(
        `SELECT * FROM user WHERE LOWER(username) = LOWER(${conn.escape(
          req.body.username
        )});`,
        (err, result) => {
          if (result.length) {
            return res.status(409).send({
              msg: 'Istnieje użytkownik o takiej nazwie!'
            });
          } else {
            // username is available
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(500).send({
                  msg: err
                });
              } else {
                // has hashed pw => add to database
                conn.query(
                  `INSERT INTO user (id, username, password, registered, userRole) VALUES ('${uuid.v4()}', ${conn.escape(
                    req.body.username
                  )}, ${conn.escape(hash)}, now(), ${conn.escape(
                    req.body.userRole
                  )})`,
                  (err, result) => {
                    if (err) {
                      throw err;
                      return res.status(400).send({
                        msg: err
                      });
                    }
                    return res.status(201).send({
                      msg: 'Zarejestrowano!'
                    });
                  }
                );
              }
            });
          }
        }
      );
});
router.post('/login', (req, res, next) => {
    conn.query(
        `SELECT * FROM user WHERE username = ${conn.escape(req.body.username)};`,
        (err, result) => {
          // user does not exists
          if (err) {
            throw err;
            return res.status(400).send({
              msg: err
            });
          }
          if (!result.length) {
            return res.status(401).send({
              msg: 'Nazwa użytkownika lub hasło są niepoprawne!'
            });
          }
          // check password
          bcrypt.compare(
            req.body.password,
            result[0]['password'],
            (bErr, bResult) => {
              // wrong password
              if (bErr) {
                throw bErr;
                return res.status(401).send({
                  msg: 'Nazwa użytkownika lub hasło są niepoprawne!'
                });
              }
              if (bResult) {
                const token = jwt.sign({
                    username: result[0].username,
                    userId: result[0].id
                  },
                  'SECRETKEY', {
                    expiresIn: '7d'
                  }
                );
                conn.query(
                  `UPDATE users SET last_login = now() WHERE id = '${result[0].id}'`
                );
                return res.status(200).send({
                  msg: 'Logged in!',
                  token,
                  user: result[0]
                });
              }
              return res.status(401).send({
                msg: 'Nazwa użytkownika lub hasło są niepoprawne!'
              });
            }
          );
        }
      );
});
router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
    console.log(req.userData);
    res.send('Tylko zalogowani użytkownicy mogą widzieć tą wiadomość.');
  });

router.post('/edit-user', userMiddleware.isLoggedIn, (req, res) => {
  var sql = $sql.user.edit;
  var params = req.body;
  console.log(params);
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).send({
        msg: err
      });
    } else {
      // has hashed pw => add to database
      conn.query(
        `UPDATE user SET password = ${conn.escape(hash)}, userRole = ${conn.escape(
          req.body.userRole
        )} WHERE id = ${conn.escape(
          req.body.userId
        )}`,
        (err, result) => {
          if (err) {
            throw err;
            return res.status(400).send({
              msg: err
            });
          }
          return res.status(201).send({
            msg: 'Success!'
          });
        }
      );
    }
  });
});
router.get('/get-user-groups-list', userMiddleware.isLoggedIn, (req, res) => {
  var sql = $sql.user.getUserGroupsList;
  var params = req.body;
  console.log(params);
  conn.query(sql, function(err, result) {
      if (err) {
          console.log(err);
      }
      if (result) {
          jsonWrite(res, result);
      }
  })
});
router.get('/get-users-list', userMiddleware.isLoggedIn, (req, res) => {
  var sql = $sql.user.getUsersList;
  var params = req.body;
  console.log(params);
  conn.query(sql, function(err, result) {
      if (err) {
          console.log(err);
      }
      if (result) {
          jsonWrite(res, result);
      }
  })
});
module.exports = router;
