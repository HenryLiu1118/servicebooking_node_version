const User = require('../models/User');
const Role = require('../models/Role');
const UserInfo = require('../models/UserInfo');
const Language = require('../models/Language');
const ServiceType = require('../models/ServiceType');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { transferUserDto } = require('../middleware/Dto');

exports.getRole = async (req, res) => {
  try {
    let roles = await Role.findAll();
    roles = roles.filter(role => role.name !== 'Admin');
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLanguage = async (req, res) => {
  try {
    let languages = await Language.findAll();
    res.json(languages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getServiceType = async (req, res) => {
  try {
    let serviceTypes = await ServiceType.findAll();
    res.json(serviceTypes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    let user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
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

  try {
    let user = await User.findOne({ where: { username: username } });

    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }

    let languageObj = await Language.findOne({ where: { name: language } });

    if (!languageObj) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Language does not exists' }] });
    }

    let roleObj = await Role.findOne({ where: { name: role } });

    if (!roleObj) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Role does not exists' }] });
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
      password: cryptedPassword
    });

    user.setRole(roleObj);
    user.setUserInfo(userInfo);

    res.status(201).json({ message: 'User Registered!' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
