const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const { check } = require('express-validator');
const filterResult = require('../../middleware/resultFilter');
const RequestOrder = require('../../models/RequestOrder');

const {
  getRequests,
  getMyRequest,
  getRequestById,
  deleteRequest,
  updateRequest,
  postRequest
} = require('../../controllers/Request');

router.use(auth);

router
  .route('/All')
  .get(authorize('Service'), filterResult(RequestOrder), getRequests);
router.route('/me').get(authorize('Customer'), getMyRequest);
router.route('/name/:serviceName').get(filterResult(RequestOrder), getRequests);
router
  .route('/language/:languageName')
  .get(filterResult(RequestOrder), getRequests);
router.route('/list/:RequestId').get(getRequestById);
router
  .route('/:serviceName/:languageName')
  .get(filterResult(RequestOrder), getRequests);
router.route('/id/:RequestId').delete(deleteRequest);

router.route('/').post(
  authorize('Customer'),
  [
    check('servicetype', 'Please enter a servicetype')
      .not()
      .isEmpty(),
    check('info', 'Please enter a info')
      .not()
      .isEmpty()
  ],
  postRequest
);

router.route('/id/:RequestId').put(authorize('Customer'), [
  check('servicetype', 'Please enter a servicetype')
    .not()
    .isEmpty(),
  check('info', 'Please enter a info')
    .not()
    .isEmpty(),
  updateRequest
]);

module.exports = router;
