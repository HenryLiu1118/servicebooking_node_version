const express = require('express');
const router = express.Router({ mergeParams: true });
const { auth, authorize } = require('../../middleware/auth');
const { check } = require('express-validator');

const {
  getLanguages,
  getRoles,
  getServiceTypes,
  getUsers,
  postLanguage,
  postServiceType,
  postRole
} = require('../../controllers/Admin');

router.route('/role').get(auth, authorize('Admin'), getRoles);
router.route('/serviceType').get(auth, authorize('Admin'), getServiceTypes);
router.route('/language').get(auth, authorize('Admin'), getLanguages);
router.route('/user').get(auth, authorize('Admin'), getUsers);

router.route('/language').post(
  auth,
  authorize('Admin'),
  [
    check('name', 'Please enter a name')
      .not()
      .isEmpty()
  ],
  postLanguage
);

router.route('/role').post(
  auth,
  authorize('Admin'),
  [
    check('name', 'Please enter a name')
      .not()
      .isEmpty()
  ],
  postRole
);

router.route('/serviceType').post(
  auth,
  authorize('Admin'),
  [
    check('name', 'Please enter a name')
      .not()
      .isEmpty()
  ],
  postServiceType
);

module.exports = router;
