import { BASE_API_URL } from "@/config";
import axios from "axios";

export const mainApiInstance = axios.create({
  baseURL: BASE_API_URL,
});

mainApiInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const err = error.toJSON();

    if (err.status === 401) {
    }

    return Promise.reject(error);
  }
);
