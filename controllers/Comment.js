const { validationResult } = require('express-validator');
const User = require('../models/User');
const RequestOrder = require('../models/RequestOrder');
const Comment = require('../models/Comment');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { transferCommentDto } = require('../middleware/Dto');

exports.postComment = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { detail } = req.body;
  let requestOrder = await RequestOrder.findByPk(req.params.RequestOrderId);

  let user = await User.findByPk(req.userId);
  let comment = await Comment.findOne({
    user_id: user.id,
    requesrOrder_id: requestOrder.id
  });
  if (comment) {
    return next(
      new ErrorResponse('You have already comment this Request!', 400)
    );
  }
  comment = await Comment.create({
    detail: detail
  });
  comment.setRequestOrder(requestOrder);
  comment.setUser(user);

  let returnComment = await transferCommentDto(comment);
  res.status(200).json(returnComment);
});

exports.getCommentsByRequestOrder = asyncHandler(async (req, res, next) => {
  let requestOrder = await RequestOrder.findByPk(req.params.RequestOrderId);
  let user = await User.findByPk(req.userId);
  let requestUser = await requestOrder.getUser();

  if (user.id !== requestUser.id) {
    return next(new ErrorResponse('RequestOrder is not yours!', 400));
  }

  let allComments = await requestOrder.getComment();
  let returnComments = [];

  for (let comment of allComments) {
    let commentDto = await transferCommentDto(comment);
    returnComments.unshift(commentDto);
  }

  res.status(200).json(returnComments);
});

exports.getCommentById = asyncHandler(async (req, res, next) => {
  let comment = await findCommentById(req.params.CommentId, req.userId);
  if (!comment) {
    return next(
      new ErrorResponse(
        'You cannot view this comment or this comment does not exists',
        400
      )
    );
  }
  let returnComment = await transferCommentDto(comment);
  res.status(200).json(returnComment);
});

exports.deleteComment = asyncHandler(async (req, res, next) => {
  let comment = await findCommentById(req.params.CommentId, req.userId);
  if (!comment) {
    return next(
      new ErrorResponse(
        'You cannot view this comment or this comment does not exists',
        400
      )
    );
  }
  await Comment.destroy({
    whiere: {
      id: comment.id
    }
  });
  res.status(201).json({ message: 'Comment deleted' });
});

exports.checkCommentByRequestOrder = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findOne({
    where: {
      user_id: req.userId,
      request_order_id: req.params.RequestOrderId
    }
  });
  if (!comment) {
    res.status(200).json(null);
  }
  let returnComment = await transferCommentDto(comment);
  res.status(200).json(returnComment);
});

let findCommentById = async (CommentId, userId) => {
  let comment = await Comment.findByPk(CommentId);
  if (!comment) {
    return null;
  }
  let requestOrder = await comment.getRequestOrder();
  let requestOrderUser = await requestOrder.getUser();
  let user = await User.findByPk(userId);
  let commentUser = await comment.getUser();

  if (user.id !== requestOrderUser.id || user.id !== commentUser.id) {
    return null;
  }
  return comment;
};
