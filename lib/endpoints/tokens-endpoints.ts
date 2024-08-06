import { makeApi, Zodios } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";
import { z } from "zod";
import { DEX_SCREENER } from "@/config";
import { dexScreenerApiInstance } from "../api";
import { PairSchema } from "./schemas";

const endpoints = makeApi([
  {
    method: "get",
    path: "/tokens/:token",
    alias: "queryPairTokens",
    requestFormat: "json",
    parameters: [],
    response: z.object({
      pairs: z.array(PairSchema).nullable(),
    }),
  },
]);

const client = new Zodios(DEX_SCREENER, endpoints, {
  axiosInstance: dexScreenerApiInstance,
});

export const tokensHooks = new ZodiosHooks("tokens", client);
