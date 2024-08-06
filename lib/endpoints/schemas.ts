import { z } from "zod";

const TokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
});

const TxnsSchema = z
  .object({
    m5: z.object({
      buys: z.number(),
      sells: z.number(),
    }),
    h1: z.object({
      buys: z.number(),
      sells: z.number(),
    }),
    h6: z.object({
      buys: z.number(),
      sells: z.number(),
    }),
    h24: z.object({
      buys: z.number(),
      sells: z.number(),
    }),
  })
  .partial();

const VolumeSchema = z
  .object({
    h24: z.number(),
    h6: z.number(),
    h1: z.number(),
    m5: z.number(),
  })
  .partial();

const PriceChangeSchema = z
  .object({
    m5: z.number(),
    h1: z.number(),
    h6: z.number(),
    h24: z.number(),
  })
  .partial();

const LiquiditySchema = z
  .object({
    usd: z.number(),
    base: z.number(),
    quote: z.number(),
  })
  .partial();

export const PairSchema = z.object({
  chainId: z.string(),
  dexId: z.string(),
  url: z.string().optional(),
  pairAddress: z.string(),
  labels: z.array(z.string()).optional(),
  baseToken: TokenSchema,
  quoteToken: TokenSchema,
  priceNative: z.string().optional(),
  priceUsd: z.string().optional(),
  txns: TxnsSchema,
  volume: VolumeSchema,
  priceChange: PriceChangeSchema,
  liquidity: LiquiditySchema.optional(),
  fdv: z.number().optional(),
  pairCreatedAt: z.number().optional(),
});

export type IPairs = z.infer<typeof PairSchema>;
