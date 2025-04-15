// api.js
import axios from 'axios';

const BASE_URL =
  'http://ec2-3-35-22-41.ap-northeast-2.compute.amazonaws.com:8000';

export const createAxiosInstance = (token = null) => {
  const instance = axios.create({ baseURL: BASE_URL });
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  return instance;
};
