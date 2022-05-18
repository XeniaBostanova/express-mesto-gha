const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');
const routerCard = require('./routes/cards');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, _, next) => {
  req.user = {
    _id: '62823deb1e0cc3090d02ef28',
  };

  next();
});

app.use('/users', router);

app.use('/cards', routerCard);

app.use((_, res) => {
  const ERR_NOT_FOUND = 404;
  res.status(ERR_NOT_FOUND).send({ message: 'Страница по указанному URL не найдена' });
});

app.listen(PORT);
