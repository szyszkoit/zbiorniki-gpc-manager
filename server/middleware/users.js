const jwt = require('jsonwebtoken');

module.exports = {
    validateRegister: (req, res, next) => {
      // username min length 3
      if (!req.body.username || req.body.username.length < 3) {
       return res.status(400).json({
         msg: 'Proszę podać nazwę o długości minimum 3 znaków.'
       });
      }
      // password min 6 chars
      if (!req.body.password || req.body.password.length < 6) {
        return res.status(400).send({
          msg: 'Proszę podać hasło o długości minimum 6 znaków.'
        });
      }
      // password (repeat) does not match
      if (
        !req.body.password_repeat ||
        req.body.password != req.body.password_repeat
      ) {
        return res.status(400).send({
          msg: 'Hasła nie są identyczne!'
        });
      }
      next();
    },
    isLoggedIn: (req, res, next) => {
        try {
          const token = req.headers.authorization;
          const decoded = jwt.verify(
            token,
            'SECRETKEY'
          );
          req.userData = decoded;
          console.log(req.userData);
          next();
        } catch (err) {
          console.log(err);
          return res.status(401).send({
            msg: 'Sesja wygasła!'
          });
        }
      }
  };