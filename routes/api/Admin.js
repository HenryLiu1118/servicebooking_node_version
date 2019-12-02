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

router.use('/', auth, authorize('Admin'));

router.route('/role').get(getRoles);
router.route('/serviceType').get(getServiceTypes);
router.route('/language').get(getLanguages);
router.route('/user').get(getUsers);

router.route('/language').post(
  [
    check('name', 'Please enter a name')
      .not()
      .isEmpty()
  ],
  postLanguage
);

router.route('/role').post(
  [
    check('name', 'Please enter a name')
      .not()
      .isEmpty()
  ],
  postRole
);

router.route('/serviceType').post(
  [
    check('name', 'Please enter a name')
      .not()
      .isEmpty()
  ],
  postServiceType
);

module.exports = router;
