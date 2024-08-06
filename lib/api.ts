import { BASE_API_URL, DEX_SCREENER } from "@/config";
import axios from "axios";

export const mainApiInstance = axios.create({
  baseURL: BASE_API_URL,
});
export const dexScreenerApiInstance = axios.create({
  baseURL: DEX_SCREENER,
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
  },
);
