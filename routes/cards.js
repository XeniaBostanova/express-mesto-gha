const routerCard = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCard.get('/', getCards);

routerCard.post('/', createCard);

routerCard.put('/:cardId/likes', likeCard);

routerCard.delete('/:cardId/likes', dislikeCard);

routerCard.delete('/:cardId', deleteCard);

module.exports = routerCard;
