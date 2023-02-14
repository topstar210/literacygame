import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_SERVERURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

API.auth = {
  login: (data) => API.post(`/auth/login`, data),
};

API.game = {
  create: (data) => API.post(`/game/create`, data),
  checkpine: (data) => API.post(`/game/checkpine`, data),
  saveSetting: (data) => API.post(`/game/${data.gamepine}/setting`, data),
  getSetting: (data) => API.get(`/game/${data.gamepine}/setting`),
};

API.file = {
    save: (data) => API.post(`/file/save`, data),
}
export default API;
