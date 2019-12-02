const User = require('../models/User');
const Language = require('../models/Language');
const ServiceType = require('../models/ServiceType');
const RequestOrder = require('../models/RequestOrder');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const { validationResult } = require('express-validator');
const { transferRequestToDto } = require('../middleware/Dto');

exports.getAllRequest = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 0;
  const limit = +req.query.limit || 2;

  let allRequestOrder = await RequestOrder.findAll();
  let requestOrders = allRequestOrder.slice(page * limit, page * limit + limit);

  let returnRequestOrders = [];
  for (let requestOrder of requestOrders) {
    let requestOrderDto = await transferRequestToDto(requestOrder);
    returnRequestOrders.unshift(requestOrderDto);
  }
  res.json({
    requestDtoList: returnRequestOrders,
    size: allRequestOrder.length
  });
});

exports.getMyRequest = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 0;
  const limit = +req.query.limit || 2;

  let allRequestOrder = await RequestOrder.findAll({
    where: { user_id: req.userId }
  });
  let requestOrders = allRequestOrder.slice(page * limit, page * limit + limit);
  let returnRequestOrders = [];
  for (let requestOrder of requestOrders) {
    let requestOrderDto = await transferRequestToDto(requestOrder);
    returnRequestOrders.unshift(requestOrderDto);
  }
  res.json({
    requestDtoList: returnRequestOrders,
    size: allRequestOrder.length
  });
});

exports.getRequestByServiceName = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 0;
  const limit = +req.query.limit || 2;

  let serviceType = await ServiceType.findOne({
    where: { name: req.params.serviceName }
  });

  if (!serviceType) {
    return next(new ErrorResponse('Service Type does not exists', 400));
  }

  let allRequestOrder = await serviceType.getRequestOrder();

  let requestOrders = allRequestOrder.slice(page * limit, page * limit + limit);
  let returnRequestOrders = [];
  for (let requestOrder of requestOrders) {
    let requestOrderDto = await transferRequestToDto(requestOrder);
    returnRequestOrders.unshift(requestOrderDto);
  }
  res.json({
    requestDtoList: returnRequestOrders,
    size: allRequestOrder.length
  });
});

exports.getRequestByLanguage = asyncHandler(async (req, res, next) => {
  const page = +req.query.page || 0;
  const limit = +req.query.limit || 2;

  let language = await Language.findOne({
    where: { name: req.params.languageName }
  });

  if (!language) {
    return next(new ErrorResponse('language does not exists', 400));
  }
  let allRequestOrder = await language.getRequestOrder();

  let requestOrders = allRequestOrder.slice(page * limit, page * limit + limit);
  let returnRequestOrders = [];
  for (let requestOrder of requestOrders) {
    let requestOrderDto = await transferRequestToDto(requestOrder);
    returnRequestOrders.unshift(requestOrderDto);
  }
  res.json({
    requestDtoList: returnRequestOrders,
    size: allRequestOrder.length
  });
});

exports.getRequestByServiceNameAndLanguage = asyncHandler(
  async (req, res, next) => {
    const page = +req.query.page || 0;
    const limit = +req.query.limit || 2;
    let serviceType = await ServiceType.findOne({
      where: { name: req.params.serviceName }
    });

    if (!serviceType) {
      return next(new ErrorResponse('Service Type does not exists', 400));
    }
    let language = await Language.findOne({
      where: { name: req.params.languageName }
    });

    if (!language) {
      return next(new ErrorResponse('language does not exists', 400));
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
  }
);

exports.getRequestById = asyncHandler(async (req, res, next) => {
  let requestOrder = await RequestOrder.findByPk(req.params.RequestId);
  if (!requestOrder) {
    return next(new ErrorResponse('requestOrder does not exists', 400));
  }
  let returnRequest = await transferRequestToDto(requestOrder);
  res.json(returnRequest);
});

exports.deleteRequest = asyncHandler(async (req, res, next) => {
  let requestOrder = await RequestOrder.findByPk(req.params.RequestId);
  if (!requestOrder) {
    return next(new ErrorResponse('requestOrder does not exists', 400));
  }
  await RequestOrder.destroy({
    where: {
      id: RequestId
    }
  });
  res.json(requestOrder);
});

exports.updateRequest = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { info, servicetype } = req.body;
  let serviceType = await ServiceType.findOne({
    where: { name: servicetype }
  });
  if (!serviceType) {
    return next(new ErrorResponse('language does not exists', 400));
  }

  let requestOrder = await RequestOrder.findByPk(req.params.RequestId);
  let requestUser = await requestOrder.getUser();
  let user = await User.findByPk(req.userId);

  if (requestUser.id !== user.id) {
    return next(new ErrorResponse('RequestOrder is not yours!', 400));
  }

  requestOrder.info = info;
  requestOrder.setServiceType(serviceType);
  await requestOrder.save({
    fields: ['info']
  });

  let returnRequest = await transferRequestToDto(requestOrder);
  res.json(returnRequest);
});

exports.postRequest = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { info, servicetype } = req.body;
  let serviceType = await ServiceType.findOne({
    where: { name: servicetype }
  });
  if (!serviceType) {
    return next(new ErrorResponse('Service does not exists', 400));
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
});
