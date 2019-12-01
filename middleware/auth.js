const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.auth = function(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No Token Found' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is inValid' });
  }
};

exports.authorize = (...roles) => {
  return async (req, res, next) => {
    let user = await User.findByPk(req.userId);
    let role = await user.getRole();
    if (!roles.includes(role.name)) {
      return res
        .status(401)
        .json({ msg: 'Not authorized to access this route' });
    }
    next();
  };
};
