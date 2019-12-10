let UserDto = async user => {
  try {
    let userInfo = await user.getUserInfo();
    let languageObj = await userInfo.getLanguage();
    let roleObj = await user.getRole();
    let ans = {
      userId: user.id,
      username: user.username,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      streetname: userInfo.streetname,
      city: userInfo.city,
      state: userInfo.state,
      zipcode: userInfo.zipcode,
      phone: userInfo.phone,
      language: languageObj.name,
      role: roleObj.name
    };
    return ans;
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.transferUserDto = UserDto;
exports.transferRequestToDto = async requestOrder => {
  let serviceType = await requestOrder.getServiceType();
  let user = await requestOrder.getUser();
  let userDto = await UserDto(user);

  let ans = {
    requestId: requestOrder.id,
    servicetype: serviceType.name,
    info: requestOrder.info,
    active: requestOrder.active,
    userDto: userDto,
    create_At: requestOrder.create_at,
    update_At: requestOrder.update_at
  };
  return ans;
};

exports.transferServiceDto = async service => {
  let serviceType = await service.getServiceType();
  let user = await service.getUser();
  let userDto = await UserDto(user);

  let ans = {
    serviceId: service.id,
    detail: service.detail,
    price: service.price,
    servicetype: serviceType.name,
    userDto: userDto
  };
  return ans;
};

exports.transferCommentDto = async comment => {
  let requestOrder = await comment.getRequestOrder();
  let user = await comment.getUser();
  let requestOrderUser = await requestOrder.getUser();
  let serviceType = await requestOrder.getServiceType();
  let userDto = await UserDto(user);
  let requestOrderUserDto = await UserDto(requestOrderUser);

  let ans = {
    commentId: comment.id,
    commentDetail: comment.detail,
    servicetype: serviceType.name,
    info: requestOrder.info,
    active: requestOrder.active,
    requestUser: requestOrderUserDto,
    userdto: userDto
  };

  return ans;
};
