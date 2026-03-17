import axios from "axios";
import { ElMessage } from "element-plus";

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果返回的状态码是200，说明接口请求成功
    if (res.code === 200 || res.success === true) {
      return res.data || res;
    } else {
      // 后端使用 msg 字段，兼容 message
      const errorMsg = res.msg || res.message || "请求失败";
      if (res.code < 400 && res.code > 403) ElMessage.error(errorMsg);
      return Promise.reject(new Error(errorMsg));
    }
  },
  (error) => {
    const { response } = error;
    if (response) {
      switch (response.status) {
        case 401:
          ElMessage.error("登录已过期，请重新登录");
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          ElMessage.error("没有权限访问该资源");
          break;
        case 404:
          ElMessage.error("请求的资源不存在");
          break;
        case 500:
          ElMessage.error("服务器内部错误");
          break;
        default:
          ElMessage.error(response.data?.message || "网络错误");
      }
    } else {
      ElMessage.error("网络连接失败");
    }
    return Promise.reject(error);
  },
);

export default request;
