const routerCard = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCard.get('/cards', getCards);

routerCard.post('/cards', createCard);

routerCard.put('/cards/:cardId/likes', likeCard);

routerCard.delete('/cards/:cardId/likes', dislikeCard);

routerCard.delete('/cards/:cardId', deleteCard);

module.exports = routerCard;
