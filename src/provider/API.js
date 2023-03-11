import axios from "axios";
import store from "store";

const axiosJWT = axios.create({
  baseURL: process.env.REACT_APP_SERVERURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

axiosJWT.interceptors.request.use(async (config) => {
  const appStore = store.getState();
  const { sapp } = appStore;
  config.headers.Authorization = `Bearer ${sapp.accToken}`;
  return config;
}, (error) => {
  return Promise.reject(error);
});
axiosJWT.defaults.withCredentials = true;

axiosJWT.auth = {
  login: (data) => axiosJWT.post(`/login`, data),
  logout: (data) => axiosJWT.post(`/logout`, data),
  register: (data) => axiosJWT.post(`/users`, data),
  getToken: () => axiosJWT.get(`/token`),
};

axiosJWT.game = {
  create: (data) => axiosJWT.post(`/game/create`, data),
  checkpine: (data) => axiosJWT.post(`/game/checkpine`, data),

  saveSetting: (data) => axiosJWT.post(`/game/${data.gamepine}/setting`, data),
  getSetting: (data) => axiosJWT.get(`/game/${data.gamepine}/setting`),

  answer: (data) => axiosJWT.post(`/game/${data.gamepine}/answer`, data),
  getAnswer: (data) => axiosJWT.get(`/game/${data.gamepine}/answer`, { params: data }),
  removeAnswer: (data) => axiosJWT.delete(`/game/${data.gamepine}/answer/${data.answerId}`),

  saveVote: (data) => axiosJWT.post(`/game/${data.gamepine}/vote`, data),
  changeUsername: (data) => axiosJWT.post(`/game/${data.gamepine}/changeusername`, data),

};

axiosJWT.file = {
  save: (data) => axiosJWT.post(`/file/save`, data),
}
export default axiosJWT;
