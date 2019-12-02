const User = require('../models/User');
const Language = require('../models/Language');
const ServiceProvide = require('../models/ServiceProvide');
const ServiceType = require('../models/ServiceType');
const ErrorResponse = require('../middleware/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

const { validationResult } = require('express-validator');
const { transferServiceDto } = require('../middleware/Dto');

exports.getMyProvide = asyncHandler(async (req, res, next) => {
  let user = await User.findOne({ where: { id: req.userId } });
  let serviceProvide = await user.getServiceProvide();
  let ans = await transferServiceDto(serviceProvide);
  res.json(ans);
});

exports.getAllProvides = asyncHandler(async (req, res, next) => {
  let services = await res.filterResult.returnModels;
  let size = await res.filterResult.size;
  let returnServices = await transferServiceDtos(services);

  res.json({
    serviceDtoList: returnServices,
    size: size
  });
});

exports.updateProvide = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }

  const { detail, price, servicename } = req.body;

  let serviceType = await ServiceType.findOne({
    where: { name: servicename }
  });
  if (!serviceType) {
    return next(new ErrorResponse('Service Type does not exists', 400));
  }

  let user = await User.findByPk(req.userId);
  let serviceProvide = await user.getServiceProvide();

  if (!serviceProvide) {
    serviceProvide = await ServiceProvide.create({
      detail: detail,
      price: price
    });
  }

  serviceProvide.detail = detail;
  serviceProvide.price = price;
  await serviceProvide.setServiceType(serviceType);

  let userInfo = await user.getUserInfo();
  let languageObj = await userInfo.getLanguage();

  await serviceProvide.setLanguage(languageObj);
  await user.setServiceProvide(serviceProvide);

  await serviceProvide.save({
    fields: ['detail', 'price']
  });

  let returnProvide = await transferServiceDto(serviceProvide);
  res.json(returnProvide);
});

let transferServiceDtos = async services => {
  let returnServices = [];
  for (let service of services) {
    let serviceDto = await transferServiceDto(service);
    returnServices.unshift(serviceDto);
  }
  return returnServices;
};
