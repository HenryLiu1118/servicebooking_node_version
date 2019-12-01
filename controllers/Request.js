const User = require('../models/User');
const Language = require('../models/Language');
const ServiceType = require('../models/ServiceType');
const RequestOrder = require('../models/RequestOrder');
const { validationResult } = require('express-validator');
const { transferRequestToDto } = require('../middleware/Dto');

exports.getAllRequest = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const limit = +req.query.limit || 2;

    let allRequestOrder = await RequestOrder.findAll();
    let requestOrders = allRequestOrder.slice(
      page * limit,
      page * limit + limit
    );

    let returnRequestOrders = [];
    for (let requestOrder of requestOrders) {
      let requestOrderDto = await transferRequestToDto(requestOrder);
      returnRequestOrders.unshift(requestOrderDto);
    }
    res.json({
      requestDtoList: returnRequestOrders,
      size: allRequestOrder.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getMyRequest = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const limit = +req.query.limit || 2;

    let allRequestOrder = await RequestOrder.findAll({
      where: { user_id: req.userId }
    });
    let requestOrders = allRequestOrder.slice(
      page * limit,
      page * limit + limit
    );
    let returnRequestOrders = [];
    for (let requestOrder of requestOrders) {
      let requestOrderDto = await transferRequestToDto(requestOrder);
      returnRequestOrders.unshift(requestOrderDto);
    }
    res.json({
      requestDtoList: returnRequestOrders,
      size: allRequestOrder.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRequestByServiceName = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const limit = +req.query.limit || 2;

    let serviceType = await ServiceType.findOne({
      where: { name: req.params.serviceName }
    });

    if (!serviceType) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Service Type does not exists' }] });
    }

    let allRequestOrder = await serviceType.getRequestOrder();

    let requestOrders = allRequestOrder.slice(
      page * limit,
      page * limit + limit
    );
    let returnRequestOrders = [];
    for (let requestOrder of requestOrders) {
      let requestOrderDto = await transferRequestToDto(requestOrder);
      returnRequestOrders.unshift(requestOrderDto);
    }
    res.json({
      requestDtoList: returnRequestOrders,
      size: allRequestOrder.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRequestByLanguage = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const limit = +req.query.limit || 2;

    let language = await Language.findOne({
      where: { name: req.params.languageName }
    });

    if (!language) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'language does not exists' }] });
    }
    let allRequestOrder = await language.getRequestOrder();

    let requestOrders = allRequestOrder.slice(
      page * limit,
      page * limit + limit
    );
    let returnRequestOrders = [];
    for (let requestOrder of requestOrders) {
      let requestOrderDto = await transferRequestToDto(requestOrder);
      returnRequestOrders.unshift(requestOrderDto);
    }
    res.json({
      requestDtoList: returnRequestOrders,
      size: allRequestOrder.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRequestByServiceNameAndLanguage = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const limit = +req.query.limit || 2;
    let serviceType = await ServiceType.findOne({
      where: { name: req.params.serviceName }
    });

    if (!serviceType) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Service Type does not exists' }] });
    }
    let language = await Language.findOne({
      where: { name: req.params.languageName }
    });

    if (!language) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'language does not exists' }] });
    }

    let allRequestOrder = await RequestOrder.findAll({
      where: {
        service_type_id: serviceType.id,
        language_id: language.id
      }
    });

    let requestOrders = allRequestOrder.slice(
      page * limit,
      page * limit + limit
    );
    let returnRequestOrders = [];
    for (let requestOrder of requestOrders) {
      let requestOrderDto = await transferRequestToDto(requestOrder);
      returnRequestOrders.unshift(requestOrderDto);
    }
    res.json({
      requestDtoList: returnRequestOrders,
      size: allRequestOrder.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getRequestById = async (req, res) => {
  try {
    let requestOrder = await RequestOrder.findByPk(req.params.RequestId);
    if (!requestOrder) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'requestOrder does not exists' }] });
    }
    let returnRequest = await transferRequestToDto(requestOrder);
    res.json(returnRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    let requestOrder = await RequestOrder.findByPk(req.params.RequestId);
    if (!requestOrder) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'requestOrder does not exists' }] });
    }
    await RequestOrder.destroy({
      where: {
        id: RequestId
      }
    });
    res.json(requestOrder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { info, servicetype } = req.body;
    let serviceType = await ServiceType.findOne({
      where: { name: servicetype }
    });
    if (!serviceType) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Language does not exists' }] });
    }

    let requestOrder = await RequestOrder.findByPk(req.params.RequestId);
    let requestUser = await requestOrder.getUser();
    let user = await User.findByPk(req.userId);

    if (requestUser.id !== user.id) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'RequestOrder is not yours!' }] });
    }

    requestOrder.info = info;
    requestOrder.setServiceType(serviceType);
    await requestOrder.save({
      fields: ['info']
    });

    let returnRequest = await transferRequestToDto(requestOrder);
    res.json(returnRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.postRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { info, servicetype } = req.body;
    let serviceType = await ServiceType.findOne({
      where: { name: servicetype }
    });
    if (!serviceType) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Service does not exists' }] });
    }
    let user = await User.findByPk(req.userId);
    let requestOrder = await RequestOrder.create({
      info: info,
      active: true
    });
    await requestOrder.setUser(user);
    let userInfo = await user.getUserInfo();
    let languageObj = await userInfo.getLanguage();
    await requestOrder.setLanguage(languageObj);
    await requestOrder.setServiceType(serviceType);

    let returnRequest = await transferRequestToDto(requestOrder);
    res.json(returnRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
