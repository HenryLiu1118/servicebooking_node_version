const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../../middleware/auth');
const { check } = require('express-validator');

const {
  postComment,
  getCommentsByRequestOrder,
  getCommentById,
  deleteComment,
  checkCommentByRequestOrder
} = require('../../controllers/Comment');

router.use(auth);

router.route('/post/:RequestOrderId').post(
  authorize('Service'),
  [
    check('detail', 'Please enter a detail')
      .not()
      .isEmpty()
  ],
  postComment
);

router.route('/get/:RequestOrderId').get(getCommentsByRequestOrder);
router.route('/id/:CommentId').get(getCommentById);
router.route('/id/:CommentId').delete(deleteComment);
router.route('/check/:RequestOrderId').get(checkCommentByRequestOrder);

module.exports = router;
