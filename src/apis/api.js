//api.js
import { request } from "../utils/request";
export const login = (data) => {
  return request({
    url: "/login",
    params: data,
    method: "GET",
  });
};
