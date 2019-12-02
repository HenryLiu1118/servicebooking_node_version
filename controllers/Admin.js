const Language = require('../models/Language');
const Role = require('../models/Role');
const ServiceType = require('../models/ServiceType');
const User = require('../models/User');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const { validationResult } = require('express-validator');
const { transferUserDto } = require('../middleware/Dto');

exports.postRole = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { name } = req.body;
  let roleObj = await Role.findOne({
    where: {
      name: name
    }
  });

  if (roleObj) {
    return next(new ErrorResponse('Rolename  already exists', 400));
  }

  roleObj = await Role.create({
    name: name
  });
  res.json(roleObj);
});

exports.postServiceType = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { name } = req.body;

  let serviceTypeObj = await ServiceType.findOne({
    where: {
      name: name
    }
  });

  if (serviceTypeObj) {
    return next(new ErrorResponse('serviceType  already exists', 400));
  }

  serviceTypeObj = await ServiceType.create({
    name: name
  });
  res.json(serviceTypeObj);
});

exports.postLanguage = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { name } = req.body;

  let languageObj = await Language.findOne({
    where: {
      name: name
    }
  });

  if (languageObj) {
    return next(new ErrorResponse('languagee  already exists', 400));
  }

  languageObj = await Language.create({
    name: name
  });
  res.json(languageObj);
});

exports.getLanguages = asyncHandler(async (req, res, next) => {
  let languages = await Language.findAll({ order: [['id', 'ASC']] });
  res.json(languages);
});

exports.getRoles = asyncHandler(async (req, res, next) => {
  let roles = await Role.findAll({ order: [['id', 'ASC']] });
  res.json(roles);
});

exports.getServiceTypes = asyncHandler(async (req, res, next) => {
  let serviceTypes = await ServiceType.findAll({ order: [['id', 'ASC']] });
  res.json(serviceTypes);
});

exports.getUsers = asyncHandler(async (req, res, next) => {
  let users = await User.findAll({ order: [['id', 'ASC']] });
  let returnUsers = [];

  for (let user of users) {
    let userDto = await transferUserDto(user);
    returnUsers.unshift(userDto);
  }

  res.json(returnUsers);
});
