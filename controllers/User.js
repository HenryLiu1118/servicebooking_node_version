const User = require('../models/User');
const Role = require('../models/Role');
const UserInfo = require('../models/UserInfo');
const Language = require('../models/Language');
const ServiceType = require('../models/ServiceType');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { transferUserDto } = require('../middleware/Dto');

exports.getRole = asyncHandler(async (req, res, next) => {
  let roles = await Role.findAll();
  roles = roles.filter(role => role.name !== 'Admin');
  res.json(roles);
});

exports.getLanguage = asyncHandler(async (req, res, next) => {
  let languages = await Language.findAll();
  res.json(languages);
});

exports.getServiceType = asyncHandler(async (req, res, next) => {
  let serviceTypes = await ServiceType.findAll();
  res.json(serviceTypes);
});

exports.Login = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => {
        return err.msg;
      })
    });
    //return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { username, password } = req.body;

  let user = await User.findOne({ where: { username: username } });
  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 400));
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 400));
  }

  const payload = {
    id: user.id
  };

  let token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 360000
  });

  let returnUser = await transferUserDto(user);
  res.json({
    token: token,
    user: returnUser
  });
});

exports.Register = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => {
        return err.msg;
      })
    });
    //return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const {
    username,
    password,
    firstname,
    lastname,
    streetname,
    city,
    state,
    zipcode,
    phone,
    role,
    language
  } = req.body;

  let user = await User.findOne({ where: { username: username } });

  if (user) {
    return next(new ErrorResponse('User already exists', 400));
  }

  let languageObj = await Language.findOne({ where: { name: language } });

  if (!languageObj) {
    return next(new ErrorResponse('Language does not exists', 400));
  }

  let roleObj = await Role.findOne({ where: { name: role } });

  if (!roleObj) {
    return next(new ErrorResponse('Role does not exists', 400));
  }

  let userInfo = await UserInfo.create({
    firstname: firstname,
    lastname: lastname,
    streetname: streetname,
    city: city,
    state: state,
    zipcode: zipcode,
    phone: phone
  });

  userInfo.setLanguage(languageObj);

  const salt = await bcrypt.genSalt(10);
  cryptedPassword = await bcrypt.hash(password, salt);

  user = await User.create({
    username: username,
    password: cryptedPassword,
    create_at: new Date()
  });

  user.setRole(roleObj);
  user.setUserInfo(userInfo);

  res.status(201).json({ message: 'User Registered!' });
});
