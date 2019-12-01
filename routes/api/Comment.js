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

router.route('/post/:RequestOrderId').post(
  auth,
  authorize('Service'),
  [
    check('detail', 'Please enter a detail')
      .not()
      .isEmpty()
  ],
  postComment
);

router.route('/get/:RequestOrderId').get(auth, getCommentsByRequestOrder);
router.route('/id/:CommentId').get(auth, getCommentById);
router.route('/id/:CommentId').delete(auth, deleteComment);
router.route('/check/:RequestOrderId').get(auth, checkCommentByRequestOrder);

module.exports = router;
