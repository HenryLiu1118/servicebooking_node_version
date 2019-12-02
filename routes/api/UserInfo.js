const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware/auth');
const { check } = require('express-validator');
const { getMyProfile, updateProfile } = require('../../controllers/UserInfo');

router.use(auth);

router.route('/').put(
  [
    check('firstname', 'Please enter a firstname')
      .not()
      .isEmpty(),
    check('lastname', 'Please enter a lastname')
      .not()
      .isEmpty(),
    check('streetname', 'Please enter a streetname')
      .not()
      .isEmpty(),
    check('city', 'Please enter a city')
      .not()
      .isEmpty(),
    check('state', 'Please enter a state')
      .not()
      .isEmpty(),
    check('zipcode', 'Please enter a zipcode')
      .not()
      .isEmpty(),
    check('phone', 'Please enter a phone')
      .not()
      .isEmpty(),
    check('language', 'Please enter a language')
      .not()
      .isEmpty()
  ],
  updateProfile
);

router.route('/me').get(getMyProfile);

module.exports = router;
