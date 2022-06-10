const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { celebrate, Joi, errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes/users');
const routerCard = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { reg } = require('./utils/reg');
const errHandler = require('./middlewares/errHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(helmet());

app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(reg)),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.get('/signout', (_, res) => {
  res.status(200).clearCookie('jwt').send({ message: 'Выход' });
});

app.use('/users', auth, router);
app.use('/cards', auth, routerCard);

app.use('*', auth, (_, res, next) => next(new NotFoundError('Страница по указанному URL не найдена')));

app.use(errorLogger);

app.use(errors());

app.use(errHandler);

app.listen(PORT);
