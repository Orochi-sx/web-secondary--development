import Axios from 'axios'

Axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data.result;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
})

export async function get(url, ...params) {
  return Axios.get(`${process.env.REACT_APP_API}${url}`, ...params)
}

export async function post(url, ...params) {
  return Axios.post(`${process.env.REACT_APP_API}${url}`, ...params)
}