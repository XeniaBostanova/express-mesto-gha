const User = require('../models/user');

const ERR_NOT_FOUND = 404;
const ERR_SERVER = 500;
const ERR_BAD_REQUEST = 400;

const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' }));
};

const getUser = (req, res) => {
  const user = req.params.userId;

  User.findById(user)
    .then((userInfo) => {
      if (!userInfo) {
        res.status(ERR_NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      return res.send(userInfo);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданный _id некорректный' });
        return;
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(ERR_NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден' });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getUser,
  createUser,
  getUsers,
  updateUserProfile,
  updateUserAvatar,
};
