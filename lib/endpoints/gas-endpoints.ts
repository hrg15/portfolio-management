import { GASPRICE_URL } from "@/config";
import { Zodios, makeApi } from "@zodios/core";
import { ZodiosHooks } from "@zodios/react";
import { z } from "zod";
import { gasApiInstance } from "../api";

const gasApi = makeApi([
  {
    method: "get",
    path: "/setting/get/GASPRICE",
    alias: "queryGasPrice",
    parameters: [],
    response: z.object({
      key: z.string(),
      value: z.string(),
    }),
  },
  {
    method: "post",
    path: "/setting/update",
    alias: "setGasPriceMutation",
    parameters: [
      {
        name: "body",
        type: "Body",
        schema: z.object({
          key: z.literal("GASPRICE"),
          value: z.string(),
        }),
      },
    ],
    response: z.any(),
  },
]);

const apiClient = new Zodios(GASPRICE_URL, gasApi, {
  axiosInstance: gasApiInstance,
});

export const gasHooks = new ZodiosHooks("gas", apiClient);
