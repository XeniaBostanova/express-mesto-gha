const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { reg } = require('../utils/reg');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), updateUserProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp(reg)).required(),
  }).unknown(true),
}), updateUserAvatar);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }).unknown(true),
}), getUser);

module.exports = router;
