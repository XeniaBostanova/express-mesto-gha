const router = require('express').Router();
const {
  getUser,
  createUser,
  getUsers,
  updateUserProfile,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.patch('/me', updateUserProfile);

router.patch('/me/avatar', updateUserAvatar);

router.get('/:userId', getUser);

router.post('/', createUser);

module.exports = router;
