const User = require('../models/User');
const Language = require('../models/Language');
const RequestOrder = require('../models/RequestOrder');
const { validationResult } = require('express-validator');
const { transferUserDto } = require('../middleware/Dto');

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
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
      return res
        .status(400)
        .json({ errors: [{ msg: 'Language does not exists' }] });
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    let user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    let returnUser = await transferUserDto(user);
    res.json(returnUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
