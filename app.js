const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi } = require('celebrate');
const router = require('./routes/users');
const routerCard = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

app.use('/users', auth, router);
app.use('/cards', auth, routerCard);

app.use((_, res, next) => next(new NotFoundError('Страница по указанному URL не найдена')));

// eslint-disable-next-line no-unused-vars
app.use((err, _, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message || 'Ошибка по умолчанию' });
  }

  return res.status(500).send({ message: 'Ошибка по умолчанию' });
});

app.listen(PORT);
