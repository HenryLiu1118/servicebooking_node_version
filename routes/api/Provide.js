const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const { check } = require('express-validator');
const filterResult = require('../../middleware/resultFilter');
const ServiceProvide = require('../../models/ServiceProvide');

const {
  getMyProvide,
  getAllProvides,
  updateProvide
} = require('../../controllers/Provide');

router.use(auth);

router.route('/').get(filterResult(ServiceProvide), getAllProvides);

router
  .route('/name/:serviceName')
  .get(filterResult(ServiceProvide), getAllProvides);

router
  .route('/language/:languageName')
  .get(filterResult(ServiceProvide), getAllProvides);

router
  .route('/:serviceName/:languageName')
  .get(filterResult(ServiceProvide), getAllProvides);

router.route('/me').get(authorize('Service'), getMyProvide);

router.route('/update').post(
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
module.exports = router;
