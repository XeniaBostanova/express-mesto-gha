const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-err');

const { JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, _, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // записываем пейлоуд в объект запроса

    next(); // пропускаем запрос дальше
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
};
