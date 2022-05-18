const Card = require('../models/сard');

const ERR_NOT_FOUND = 404;
const ERR_SERVER = 500;
const ERR_BAD_REQUEST = 400;

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cardInfo) => {
      if (!cardInfo) {
        return res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      console.log('err', err);
      if (err.kind === 'ObjectId') {
        return res.status(ERR_BAD_REQUEST).send({ message: 'Переданный _id некорректный' });
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

const getCards = (_, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    . catch(() => res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(ERR_NOT_FOUND).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        return res.status(ERR_BAD_REQUEST).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(ERR_SERVER).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
