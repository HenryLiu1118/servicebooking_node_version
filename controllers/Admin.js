const Language = require('../models/Language');
const Role = require('../models/Role');
const ServiceType = require('../models/ServiceType');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { transferUserDto } = require('../middleware/Dto');

exports.postRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  try {
    let roleObj = await Role.findOne({
      where: {
        name: name
      }
    });

    if (roleObj) {
      return res.status(400).json({
        errors: [{ msg: 'Rolename  already exists' }]
      });
    }

    roleObj = await Role.create({
      name: name
    });
    res.json(roleObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.postServiceType = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  try {
    let serviceTypeObj = await ServiceType.findOne({
      where: {
        name: name
      }
    });

    if (serviceTypeObj) {
      return res.status(400).json({
        errors: [{ msg: 'serviceType  already exists' }]
      });
    }

    serviceTypeObj = await ServiceType.create({
      name: name
    });
    res.json(serviceTypeObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.postLanguage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  try {
    let languageObj = await Language.findOne({
      where: {
        name: name
      }
    });

    if (languageObj) {
      return res.status(400).json({
        errors: [{ msg: 'languagee  already exists' }]
      });
    }

    languageObj = await Language.create({
      name: name
    });
    res.json(languageObj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getLanguages = async (req, res) => {
  try {
    let languages = await Language.findAll();
    res.json(languages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRoles = async (req, res) => {
  try {
    let roles = await Role.findAll();
    res.json(roles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getServiceTypes = async (req, res) => {
  try {
    let serviceTypes = await ServiceType.findAll();
    res.json(serviceTypes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUsers = async (req, res) => {
  try {
    let users = await User.findAll();
    let returnUsers = [];

    for (let user of users) {
      let userDto = await transferUserDto(user);
      returnUsers.unshift(userDto);
    }

    res.json(returnUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
