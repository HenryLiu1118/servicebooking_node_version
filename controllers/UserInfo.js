const User = require('../models/User');
const Language = require('../models/Language');
const RequestOrder = require('../models/RequestOrder');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const { validationResult } = require('express-validator');
const { transferUserDto } = require('../middleware/Dto');

exports.updateProfile = asyncHandler(async (req, res, next) => {
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
    firstname,
    lastname,
    streetname,
    city,
    state,
    zipcode,
    phone,
    language
  } = req.body;

  let languageObj = await Language.findOne({ where: { name: language } });

  if (!languageObj) {
    return next(new ErrorResponse('Language does not exists', 400));
  }

  let user = await User.findByPk(req.userId);
  let userInfo = await user.getUserInfo();
  userInfo.firstname = firstname;
  userInfo.lastname = lastname;
  userInfo.streetname = streetname;
  userInfo.city = city;
  userInfo.state = state;
  userInfo.zipcode = zipcode;
  userInfo.phone = phone;

  let pastLanguageObj = await userInfo.getLanguage();
  if (language !== pastLanguageObj.name) {
    let role = await user.getRole();
    if (role.name === 'Service') {
      let serviceProvide = await user.getServiceProvide();
      await serviceProvide.setLanguage(languageObj);
    } else if (role.name === 'Customer') {
      await RequestOrder.update(
        { language_id: languageObj.id },
        { where: { user_id: user.id } }
      );
    }
  }

  await userInfo.setLanguage(languageObj);

  await userInfo.save({
    fields: [
      'firstname',
      'lastname',
      'streetname',
      'city',
      'state',
      'zipcode',
      'phone'
    ]
  });

  let returnUser = await transferUserDto(user);
  res.json(returnUser);
});

exports.getMyProfile = asyncHandler(async (req, res, next) => {
  let user = await User.findByPk(req.userId);
  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 400));
  }
  let returnUser = await transferUserDto(user);
  res.json(returnUser);
});
