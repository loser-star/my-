// import hyRequest from "./request/index";

// export default hyRequest;

import axios from "axios";
import { message } from "antd";
const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:4000",
  timeout: 3000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url === "/login") {
      return config;
    }
    // console.log("请求拦截");

    // 设置Authorization

    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      config.headers.authorization = "Bearer " + accessToken;
    }

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

let refreshing = false;
const queue = [];

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;
    console.log(data, config);
    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/admin/refresh")) {
      refreshing = true;
      const res = await refreshToken();
      refreshing = false;
      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

async function refreshToken() {
  const res = await axiosInstance.get("/user/admin/refresh", {
    params: {
      refreshToken: localStorage.getItem("refresh_token"),
    },
  });
  localStorage.setItem("access_token", res.data.data.access_token || "");
  localStorage.setItem("refresh_token", res.data.data.refresh_token || "");
  return res;
}

export default axiosInstance;
