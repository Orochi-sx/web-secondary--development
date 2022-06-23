import axios from "axios";
import qs from "querystringify";

let apiContextPath = "";
if (process.env.NODE_ENV === "development") {
  // document.cookie =
  //   "token=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY1NTk1MjA5NTE1OCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.os_lzxdJWA4GAPozXUB09wrvEDJ0Ed3hGcTcEN_isdk";
  // document.cookie =
  //   "refreshToken=eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY1NTk1MjA5NTE3Mn0.tylsUCOFSgMImTPNAuOIJb3Ds9wSOxaHabETBM_vcE8";
  document.cookie = "username=admin";
  document.cookie = "windowOnline=true";
  apiContextPath = "/api";
}

// eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY1NTk1MjA5NTE1OCwidXNlcklkIjoiMTIzNDU2Nzg5MCJ9.os_lzxdJWA4GAPozXUB09wrvEDJ0Ed3hGcTcEN_isdk

// eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY1NTg4NDE5MjAxOH0.CVsNy2UgWs-hSJ3RtWgSSmIb4XCFaAYHwjeffJBoYQc

// eyJhbGciOiJIUzI1NiJ9.eyJsb2dpblRpbWVzdGFtcCI6MTY1NTk1MjA5NTE3Mn0.tylsUCOFSgMImTPNAuOIJb3Ds9wSOxaHabETBM_vcE8



const instance = axios.create({
  baseURL: `${apiContextPath}/sdata/rest`,
  timeout: 60000,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  headers:
    (window.location.search && qs.parse(window.location.search).token) ||
    window.token
      ? { token: qs.parse(window.location.search).token || window.token }
      : {},
});

instance.defaults.headers.post["Content-Type"] = "application/json";

instance.interceptors.response.use(
  response => {
    let { data } = response;
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (data && data.status !== 200 && !(data instanceof Blob)) {
      return Promise.reject(response);
    }
    if (data instanceof Blob) {
      response.data = data;
      return response;
    }

    response.data = data && data.result;
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      return;
    }

    return Promise.reject(error.response);
  }
);

export default instance;
