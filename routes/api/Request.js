const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const { check } = require('express-validator');

const {
  getAllRequest,
  getMyRequest,
  getRequestByServiceName,
  getRequestByLanguage,
  getRequestById,
  getRequestByServiceNameAndLanguage,
  deleteRequest,
  updateRequest,
  postRequest
} = require('../../controllers/Request');

router.route('/').post(
  auth,
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

router.route('/id/:RequestId').put(auth, authorize('Customer'), [
  check('servicetype', 'Please enter a servicetype')
    .not()
    .isEmpty(),
  check('info', 'Please enter a info')
    .not()
    .isEmpty(),
  updateRequest
]);

router.route('/All').get(auth, authorize('Service'), getAllRequest);
router.route('/me').get(auth, authorize('Customer'), getMyRequest);
router.route('/name/:serviceName').get(auth, getRequestByServiceName);
router.route('/language/:languageName').get(auth, getRequestByLanguage);
router.route('/list/:RequestId').get(auth, getRequestById);
router
  .route('/:serviceName/:languageName')
  .get(auth, getRequestByServiceNameAndLanguage);
router.route('/id/:RequestId').delete(auth, deleteRequest);

module.exports = router;
