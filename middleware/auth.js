const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('./errorResponse');

exports.auth = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return next(new ErrorResponse('No Token Found', 401));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return next(new ErrorResponse('Token is inValid', 401));
  }
};

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    let user = await User.findByPk(req.userId);
    let role = await user.getRole();
    if (!roles.includes(role.name)) {
      return next(
        new ErrorResponse(
          `User role: ${role.name} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
