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

  answer: (data) => API.post(`/game/${data.gamepine}/answer`, data),
  getAnswer: (data) => API.get(`/game/${data.gamepine}/answer`, { params: data }),
  removeAnswer: (data) => API.delete(`/game/${data.gamepine}/answer/${data.answerId}`),

  saveVote: (data) => API.post(`/game/${data.gamepine}/vote`, data),
  changeUsername: (data) => API.post(`/game/${data.gamepine}/changeusername`, data),

};

API.file = {
    save: (data) => API.post(`/file/save`, data),
}
export default API;
