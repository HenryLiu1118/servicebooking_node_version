const Language = require('../models/Language');
const ServiceType = require('../models/ServiceType');

const filterResult = model => async (req, res, next) => {
  const page = +req.query.page || 0;
  const limit = +req.query.limit || 2;
  let serviceName = req.params.serviceName;
  let languageName = req.params.languageName;

  let allModel = [];
  let serviceType = null;
  let language;

  if (serviceName) {
    serviceType = await ServiceType.findOne({
      where: { name: req.params.serviceName }
    });
    if (!serviceType) {
      return next(new ErrorResponse('Service Type does not exists', 400));
    }
  }

  if (languageName) {
    language = await Language.findOne({
      where: { name: req.params.languageName }
    });
    if (!language) {
      return next(new ErrorResponse('language does not exists', 400));
    }
  }

  if (serviceName && languageName) {
    allModel = await model.findAll({
      where: {
        service_type_id: serviceType.id,
        language_id: language.id
      }
    });
  } else if (serviceName) {
    allModel = await model.findAll({
      where: {
        service_type_id: serviceType.id
      }
    });
  } else if (languageName) {
    allModel = await model.findAll({
      where: {
        language_id: language.id
      }
    });
  } else {
    allModel = await model.findAll();
  }

  let returnModels = allModel.slice(page * limit, page * limit + limit);

  res.filterResult = {
    returnModels: returnModels,
    size: allModel.length
  };

  next();
};

module.exports = filterResult;
