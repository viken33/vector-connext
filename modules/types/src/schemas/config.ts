import { Static, Type } from "@sinclair/typebox";

import { TContractAddresses, TUrl } from ".";

export const VectorNodeConfigSchema = Type.Object({
  adminToken: Type.String(),
  authUrl: Type.Optional(Type.String({ format: "uri" })),
  chainAddresses: Type.Map(TContractAddresses),
  chainProviders: Type.Map(TUrl),
  dbUrl: Type.Optional(TUrl),
  logLevel: Type.Optional(
    Type.Union([
      Type.Literal("fatal"),
      Type.Literal("error"),
      Type.Literal("warn"),
      Type.Literal("info"),
      Type.Literal("debug"),
      Type.Literal("trace"),
      Type.Literal("silent"),
    ]),
  ),
  messagingUrl: Type.Optional(TUrl),
  mnemonic: Type.Optional(Type.String()),
  natsUrl: Type.Optional(TUrl),
  redisUrl: TUrl,
});

export type VectorNodeConfig = Static<typeof VectorNodeConfigSchema>;
