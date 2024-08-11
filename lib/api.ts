import { DEX_SCREENER, GASPRICE_URL } from "@/config";
import axios from "axios";

export const dexScreenerApiInstance = axios.create({
  baseURL: DEX_SCREENER,
});

export const gasApiInstance = axios.create({
  baseURL: GASPRICE_URL,
});
