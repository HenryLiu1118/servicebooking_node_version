const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  getRole,
  getLanguage,
  getServiceType,
  Login,
  Register
} = require('../../controllers/User');

router.route('/login').post(
  [
    check('username', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password')
      .not()
      .isEmpty()
  ],
  Login
);

router.route('/register').post(
  [
    check('username', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password')
      .not()
      .isEmpty(),
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
    check('role', 'Please enter a role')
      .not()
      .isEmpty(),
    check('language', 'Please enter a language')
      .not()
      .isEmpty()
  ],
  Register
);

router.route('/role').get(getRole);

router.route('/serviceType').get(getServiceType);

router.route('/language').get(getLanguage);

module.exports = router;
