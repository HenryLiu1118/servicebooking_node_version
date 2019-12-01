const { validationResult } = require('express-validator');
const User = require('../models/User');
const RequestOrder = require('../models/RequestOrder');
const Comment = require('../models/Comment');
const { transferCommentDto } = require('../middleware/Dto');

exports.postComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { detail } = req.body;
    let requestOrder = await RequestOrder.findByPk(req.params.RequestOrderId);

    let user = await User.findByPk(req.userId);
    let comment = await Comment.findOne({
      user_id: user.id,
      requesrOrder_id: requestOrder.id
    });
    if (comment) {
      return res.status(400).json({
        errors: [{ msg: 'You have already comment this Request!' }]
      });
    }
    comment = await Comment.create({
      detail: detail
    });
    comment.setRequestOrder(requestOrder);
    comment.setUser(user);

    let returnComment = await transferCommentDto(comment);
    res.json(returnComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCommentsByRequestOrder = async (req, res) => {
  try {
    let requestOrder = await RequestOrder.findByPk(req.params.RequestOrderId);
    let user = await User.findByPk(req.userId);
    let requestUser = await requestOrder.getUser();

    if (user.id !== requestUser.id) {
      return res.status(400).json({
        errors: [{ msg: 'RequestOrder is not yours!' }]
      });
    }

    let allComments = await requestOrder.getComment();
    let returnComments = [];

    for (let comment of allComments) {
      let commentDto = await transferCommentDto(comment);
      returnComments.unshift(commentDto);
    }

    res.json(returnComments);
  } catch (err) {
    console.error('==========' + err.message);
    res.status(500).send('Server Error');
  }
};

exports.getCommentById = async (req, res) => {
  try {
    let comment = await findCommentById(req.params.CommentId, req.userId);
    if (!comment) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Comment does not exists' }] });
    }
    let returnComment = await transferCommentDto(comment);
    res.json(returnComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    let comment = await findCommentById(req.params.CommentId, req.userId);
    if (!comment) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Comment does not exists' }] });
    }
    await Comment.destroy({
      whiere: {
        id: comment.id
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.checkCommentByRequestOrder = async (req, res) => {
  try {
    let comment = await Comment.findOne({
      where: {
        user_id: req.userId,
        requestOrder_id: req.params.RequestOrderId
      }
    });
    if (!comment) {
      res.json(null);
    }
    let returnComment = await transferCommentDto(comment);
    res.json(returnComment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

let findCommentById = async (CommentId, userId) => {
  try {
    let comment = await Comment.findByPk(CommentId);
    if (!comment) {
      return null;
    }
    let requestOrder = await comment.getRequestOrder();
    let requestOrderUser = await requestOrder.getUser();
    let user = await User.findByPk(userId);
    let commentUser = await comment.getUser();

    if (user.id !== requestOrderUser.id || user.id !== commentUser.id) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'You cannot view this comment' }] });
    }
    return comment;
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
