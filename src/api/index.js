import { get, post } from "./http";
// import { message } from "antd";

// 业务接口聚集
const FetchApi = (e, callback, errCallback) => {
  let urlArg = "/sdata/rest/" + e.url;
  if (process.env.NODE_ENV === "development") {
    document.cookie =
      "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY1Njg2ODg1MTU4OCwidXNlcklkIjoiMThkZDcwYzUtNzZhZi00MjNkLTg2ODUtM2EyZGEyYjdiZTVmIn0.9hwOkMCV4KveTQm1MI3maekB7ufsmpx2HvegBgUI3gk";
    document.cookie = "username=18952038519";
    document.cookie = "JSESSIONID=A6F15C2F5DB80A4967CA8452E32E4973";
    document.cookie = "authPicKey=30b7e977542e499390e9b6addc65d18d";
  }
  if (!urlArg) {
    return console.log("url 不存在");
  }
  let url = urlArg;
  let params = e.params;
  if (e.type === "get") {
    return get(url, params).then(function (data) {
      if (data?.status !== 500 && data != null) {
        callback(data);
      }
    });
  } else if (e.type === "post") {
    return post(url, params)
      .then(function (data) {
        callback && callback(data);
      })
      .catch(function (err) {
        console.log(err);
        errCallback && errCallback(err);
      });
  }
};

// const PopupTips = (type, data, description) => {
//   if (description !== undefined && description !== "") {
//     message[type](description);
//   } else {
//     message[type](data);
//   }
// };

export const queryUserAll = function (callback) {
  let param = {
    url: `system/user`,
    type: "get",
    params: {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};

export const AuthorityUser = function (callback) {
  let param = {
    url: `system/authority/user`,
    type: "get",
    params: {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};

export const queryOfficeDelCreateMember = function (id, callback) {
  let param = {
    url: `system/office?createMember=${id}`,
    type: "get",
    params: {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};

export const queryCurrentOfficeUsers = function (id, callback) {
  let param = {
    url: `datapp/workStationDispatch/queryCurrentOfficeUsers`,
    type: "post",
    params: {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
// 内部派工 下拉框
export const insideDispatch = function (callback) {
  let param = {
    url: `productiveTask/insideDispatch`,
    type: "get",
    params: {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
// 委托派工 下拉框
export const queryUserInfoByID = function (params, callback) {
  let param = {
    url: `productiveTask/queryUserInfoByID?type=${params}`,
    type: "get",
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
//内部派工 弹窗确认按钮 新增
export const insideDispatchInsert = function (params, callback) {
  let param = {
    url: `productiveTask/insideDispatchInsert`,
    type: "post",
    params: params || {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
//弹窗更新接口
export const updateDispatchDate = function (params, callback) {
  let param = {
    url: `productiveTask/updateDispatchDate`,
    type: "post",
    params: params,
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
//查询生产任务数据
export const prodInsNoId = function (queryCondition, callback) {
  let param = {
    url: `productiveTask/prodInsNoId`,
    type: "post",
    params: queryCondition || {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
// 删除
export const logicDelete = function (params, callback) {
  let param = {
    url: `productiveTask/logicDelete?dataId=${params?.dataId}&dispType=${params?.dispType}&dispStatus=${params.dispStatus}`,
    type: "get",
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
//最后提交
export const updateDispStatus = function (params, callback) {
  let param = {
    url: `productiveTask/updateDispStatus`,
    type: "post",
    params: params,
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
//根据生产任务查询工序列表
export const prodInsById = function (params, callback) {
  let param = {
    url: `productiveTask/prodInsById`,
    type: "post",
    params: params,
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};

//查询工位列表,包含加工信息
export const queryWorkStations = function (params, callback) {
  let param = {
    url: `productiveTask/queryWorkStations`,
    type: "post",
    params: params || {},
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};

//查询节假日期列表
export const queryFestivalDays = function (params, callback) {
  let param = {
    url: `datapp/workStationDispatch/queryFestivalDays`,
    type: "get",
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};

//保存派工信息
export const saveDispatch = function (params, callback, errCallback) {
  let param = {
    url: `datapp/workStationDispatch/saveDispatch`,
    type: "post",
    params: params || {},
  };
  FetchApi(
    param,
    function (data) {
      callback && callback(data?.results || data || {});
    },
    function (err) {
      errCallback && errCallback(err);
    }
  );
};

//查询节假日期列表
export const queryWorkTime = function (params, callback) {
  let param = {
    url: `datapp/workStationDispatch/queryWorkTime?compCode=${params?.compCode}&processNo=${params?.processNo}`,
    type: "post",
  };
  FetchApi(param, function (data) {
    callback && callback(data?.results || data || {});
  });
};
