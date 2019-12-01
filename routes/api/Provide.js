const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const { check } = require('express-validator');

const {
  getMyProvide,
  getAllProvide,
  getProvideByServiceName,
  getProvideByLanguage,
  getProvideByServiceNameAndLanguage,
  updateProvide
} = require('../../controllers/Provide');

router.route('/update').post(
  auth,
  authorize('Service'),
  [
    check('detail', 'Please enter a password')
      .not()
      .isEmpty(),
    check('price', 'Please enter a password')
      .not()
      .isEmpty(),
    check('servicename', 'Please enter a password')
      .not()
      .isEmpty()
  ],
  updateProvide
);
router.get('/', auth, getAllProvide);
router.get('/name/:serviceName', auth, getProvideByServiceName);
router.get('/language/:languageName', auth, getProvideByLanguage);
router.get(
  '/:serviceName/:languageName',
  auth,
  getProvideByServiceNameAndLanguage
);
router.route('/me').get(auth, authorize('Service'), getMyProvide);

module.exports = router;
