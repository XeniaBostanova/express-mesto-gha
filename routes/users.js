const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.patch('/users/me', updateUserProfile);

router.patch('/users/me/avatar', updateUserAvatar);

router.get('/users/:userId', getUser);

router.post('/users', createUser);

module.exports = router;
