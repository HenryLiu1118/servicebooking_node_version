const sequelize = require('./db');
//models
const User = require('../models/User');
const UserInfo = require('../models/UserInfo');
const ServiceType = require('../models/ServiceType');
const ServiceProvide = require('../models/ServiceProvide');
const Role = require('../models/Role');
const Language = require('../models/Language');
const RequestOrder = require('../models/RequestOrder');
const Comment = require('../models/Comment');

User.belongsTo(UserInfo, { as: 'UserInfo', foreignKey: 'user_info_id' });
UserInfo.hasOne(User, { as: 'User', foreignKey: 'user_info_id' });

User.belongsTo(ServiceProvide, {
  as: 'ServiceProvide',
  foreignKey: 'serviceprovide_id'
});
ServiceProvide.hasOne(User, { as: 'User', foreignKey: 'serviceprovide_id' });

User.belongsTo(Role, { as: 'Role', foreignKey: 'role_id' });
Role.hasMany(User, { as: 'User', foreignKey: 'role_id' });

UserInfo.belongsTo(Language, { as: 'Language', foreignKey: 'language_id' });
Language.hasMany(UserInfo, { as: 'UserInfo', foreignKey: 'language_id' });

ServiceProvide.belongsTo(ServiceType, {
  as: 'ServiceType',
  foreignKey: 'service_type_id'
});
ServiceType.hasMany(ServiceProvide, {
  as: 'ServiceProvide',
  foreignKey: 'service_type_id'
});

ServiceProvide.belongsTo(Language, {
  as: 'Language',
  foreignKey: 'language_id'
});
Language.hasMany(ServiceProvide, {
  as: 'ServiceProvide',
  foreignKey: 'language_id'
});

RequestOrder.belongsTo(User, { as: 'User', foreignKey: 'user_id' });
User.hasMany(RequestOrder, { as: 'RequestOrder', foreignKey: 'user_id' });

RequestOrder.belongsTo(ServiceType, {
  as: 'ServiceType',
  foreignKey: 'service_type_id'
});
ServiceType.hasMany(RequestOrder, {
  as: 'RequestOrder',
  foreignKey: 'service_type_id'
});

RequestOrder.belongsTo(Language, { as: 'Language', foreignKey: 'language_id' });
Language.hasMany(RequestOrder, {
  as: 'RequestOrder',
  foreignKey: 'language_id'
});

Comment.belongsTo(RequestOrder, {
  as: 'RequestOrder',
  foreignKey: 'request_order_id'
});
RequestOrder.hasMany(Comment, {
  as: 'Comment',
  foreignKey: 'request_order_id'
});

Comment.belongsTo(User, { as: 'User', foreignKey: 'user_id' });
User.hasMany(Comment, { as: 'Comment', foreignKey: 'user_id' });

const connectDB = async () => {
  try {
    //sequelize.sync({ force: true });
    //sequelize.sync();
    sequelize.authenticate();
    console.log('MySQL Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
