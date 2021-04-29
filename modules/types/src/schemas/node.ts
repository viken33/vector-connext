import { Static, TLiteral, Type } from "@sinclair/typebox";

import { EngineEvent, EngineEvents } from "../engine";

import { EngineParams } from "./engine";
import {
  TUrl,
  TAddress,
  TPublicIdentifier,
  TIntegerString,
  TBytes32,
  TFullTransferState,
  TFullChannelState,
  TChainId,
  AllowedSwapSchema,
  TContractAddresses,
  TransferQuoteSchema,
  WithdrawalQuoteSchema,
  TSignature,
  TBytes,
  TransferDisputeSchema,
  ChannelDisputeSchema,
  TVectorErrorJson,
} from "./basic";

////////////////////////////////////////
// Server Node API Parameter schemas

// The server node serves as a thin REST-based wrapper around
// the engine. It will take in HTTP requests, and make the
// appropriate engine rpc calls

// Shared type for all successful channel actions
const BasicChannelServerResponseSchema = {
  200: Type.Object({
    channelAddress: TAddress,
  }),
};

// Shared type for all successful transfer actions
const BasicTransferServerResponseSchema = {
  200: Type.Object({
    channelAddress: TAddress,
    transferId: TBytes32,
    routingId: Type.Optional(TBytes32),
  }),
};

// GET WITHDRAWAL QUOTE
const PostWithdrawalQuoteParamsSchema = Type.Intersect([
  EngineParams.GetWithdrawalQuoteSchema,
  Type.Object({
    publicIdentifier: TPublicIdentifier,
  }),
]);

const PostWithdrawalQuoteResponseSchema = {
  200: WithdrawalQuoteSchema,
};

// GET TRANSFER QUOTE
const PostTransferQuoteParamsSchema = Type.Intersect([
  EngineParams.GetTransferQuoteSchema,
  Type.Object({
    publicIdentifier: TPublicIdentifier,
  }),
]);

const PostTransferQuoteResponseSchema = {
  200: TransferQuoteSchema,
};

// GET ROUTER CONFIG
const GetRouterConfigParamsSchema = Type.Intersect([
  EngineParams.GetRouterConfigSchema,
  Type.Object({
    publicIdentifier: TPublicIdentifier,
  }),
]);

const GetRouterConfigResponseSchema = {
  200: Type.Object({
    supportedChains: Type.Array(TChainId),
    allowedSwaps: Type.Array(AllowedSwapSchema),
  }),
};

// GET TRANSFER BY ROUTINGID
const GetTransferStateByRoutingIdParamsSchema = Type.Intersect([
  EngineParams.GetTransferStateByRoutingIdSchema,
  Type.Object({
    publicIdentifier: TPublicIdentifier,
  }),
]);

const GetTransferStateByRoutingIdResponseSchema = {
  200: Type.Union([Type.Undefined(), TFullTransferState]),
};

// GET TRANSFERS BY ROUTINGID
const GetTransferStatesByRoutingIdParamsSchema = Type.Intersect([
  EngineParams.GetTransferStatesByRoutingIdSchema,
  Type.Object({
    publicIdentifier: TPublicIdentifier,
  }),
]);

const GetTransferStatesByRoutingIdResponseSchema = {
  200: Type.Array(TFullTransferState),
};

// GET ACTIVE TRANSFERS BY ADDR
const GetActiveTransfersByChannelAddressParamsSchema = Type.Intersect([
  EngineParams.GetActiveTransfersSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetActiveTransfersByChannelAddressResponseSchema = {
  200: Type.Array(TFullTransferState),
};

// GET TRANSFERS BY TRANSFERID
const GetTransferStateParamsSchema = Type.Intersect([
  EngineParams.GetTransferStateSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetTransferStateResponseSchema = {
  200: Type.Union([Type.Undefined(), TFullTransferState]),
};

// GET TRANSFERS
const GetTransfersParamsSchema = Type.Object({ publicIdentifier: TPublicIdentifier });

const GetTransfersResponseSchema = {
  200: Type.Array(TFullTransferState),
};

// GET CHANNEL STATE
const GetChannelStateParamsSchema = Type.Intersect([
  EngineParams.GetChannelStateSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetChannelStateResponseSchema = {
  200: Type.Union([Type.Undefined(), TFullChannelState]),
};

// GET CHANNEL STATES
const GetChannelStatesParamsSchema = Type.Intersect([
  EngineParams.GetChannelStatesSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetChannelStatesResponseSchema = {
  200: Type.Array(TAddress),
};

// GET CHANNEL STATE BY PARTICIPANTS
const GetChannelStateByParticipantsParamsSchema = Type.Object({
  publicIdentifier: TPublicIdentifier,
  counterparty: TPublicIdentifier,
  chainId: TChainId,
});

const GetChannelStateByParticipantsResponseSchema = GetChannelStateResponseSchema;

// GET CONFIG
const GetConfigResponseSchema = {
  200: Type.Array(
    Type.Object({
      publicIdentifier: TPublicIdentifier,
      signerAddress: TAddress,
      index: Type.Integer(),
      chainAddresses: Type.Dict(TContractAddresses),
    }),
  ),
};

// GET STATUS
const GetStatusResponseSchema = {
  200: Type.Object({
    publicIdentifier: TPublicIdentifier,
    signerAddress: TAddress,
    providerSyncing: Type.Dict(
      Type.Union([
        Type.Boolean(),
        Type.Object({
          startingBlock: Type.String(),
          currentBlock: Type.String(),
          highestBlock: Type.String(),
        }),
        Type.String(),
        Type.Undefined(),
      ]),
    ),
    version: Type.String(),
  }),
};

// GET LISTENER
const GetListenerParamsSchema = Type.Object({
  eventName: Type.Union(Object.values(EngineEvents).map((e) => Type.Literal(e)) as [TLiteral<EngineEvent>]),
  publicIdentifier: TPublicIdentifier,
});

const GetListenerResponseSchema = {
  200: Type.Object({ url: TUrl }),
};

// GET LISTENERS
const GetListenersParamsSchema = Type.Object({ publicIdentifier: TPublicIdentifier });

const GetListenersResponseSchema = {
  200: Type.Dict(TUrl),
};

// GET REGISTERED TRANSFERS
const GetRegisteredTransfersParamsSchema = Type.Intersect([
  EngineParams.GetRegisteredTransfersSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetRegisteredTransfersResponseSchema = {
  200: Type.Array(
    Type.Object({
      name: Type.String(),
      stateEncoding: Type.String(),
      resolverEncoding: Type.String(),
      definition: TAddress,
      encodedCancel: Type.String(),
    }),
  ),
};

// GET WITHDRAWAL COMMITMENT
const GetWithdrawalCommitmentParamsSchema = Type.Intersect([
  EngineParams.GetWithdrawalCommitmentSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetWithdrawalCommitmentResponseSchema = {
  200: Type.Union([
    Type.Undefined(),
    Type.Object({
      aliceSignature: Type.Optional(TSignature),
      bobSignature: Type.Optional(TSignature),
      channelAddress: TAddress,
      alice: TAddress,
      bob: TAddress,
      recipient: TAddress,
      assetId: TAddress,
      amount: TIntegerString,
      nonce: TIntegerString,
      callTo: TAddress,
      callData: TBytes,
      transactionHash: Type.Optional(TBytes32),
    }),
  ]),
};

// GET WITHDRAWAL COMMITMENT BY HASH
const GetWithdrawalCommitmentByTransactionHashParamsSchema = Type.Intersect([
  EngineParams.GetWithdrawalCommitmentByTransactionHashSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetWithdrawalCommitmentByTransactionHashResponseSchema = {
  200: Type.Union([
    Type.Undefined(),
    Type.Object({
      aliceSignature: Type.Optional(TSignature),
      bobSignature: Type.Optional(TSignature),
      channelAddress: TAddress,
      alice: TAddress,
      bob: TAddress,
      recipient: TAddress,
      assetId: TAddress,
      amount: TIntegerString,
      nonce: TIntegerString,
      callTo: TAddress,
      callData: TBytes,
      transactionHash: Type.Optional(TBytes32),
    }),
  ]),
};

// REGISTER LISTENER
const PostRegisterListenerBodySchema = Type.Object({
  publicIdentifier: TPublicIdentifier,
  events: Type.Dict(Type.String()),
});

const PostRegisterListenerResponseSchema = {
  200: Type.Object({
    message: Type.String(),
  }),
};

// POST SETUP
const PostSetupBodySchema = Type.Intersect([
  EngineParams.SetupSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSetupResponseSchema = BasicChannelServerResponseSchema;

// POST REQUEST SETUP
const PostRequestSetupBodySchema = PostSetupBodySchema;

const PostRequestSetupResponseSchema = BasicChannelServerResponseSchema;

// POST DEPOSIT
const PostDepositBodySchema = Type.Intersect([
  EngineParams.DepositSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostDepositResponseSchema = BasicChannelServerResponseSchema;

// POST DEPOSIT
const PostRequestCollateralBodySchema = Type.Intersect([
  EngineParams.RequestCollateralSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostRequestCollateralResponseSchema = BasicChannelServerResponseSchema;

// POST SEND DEPOSIT TX
const PostSendDepositTxBodySchema = Type.Object({
  channelAddress: TAddress,
  amount: TIntegerString,
  assetId: TAddress,
  chainId: TChainId,
  publicIdentifier: TPublicIdentifier,
});

const PostSendDepositTxResponseSchema = {
  200: Type.Object({
    txHash: TBytes32,
  }),
};

// POST CREATE CONDITIONAL TRANSFER
const PostConditionalTransferBodySchema = Type.Intersect([
  EngineParams.ConditionalTransferSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostConditionalTransferResponseSchema = BasicTransferServerResponseSchema;

// POST RESOLVE CONDITIONAL TRANSFER
const PostResolveTransferBodySchema = Type.Intersect([
  EngineParams.ResolveTransferSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostResolveTransferResponseSchema = BasicTransferServerResponseSchema;

// POST WITHDRAW TRANSFER
const PostWithdrawTransferBodySchema = Type.Intersect([
  EngineParams.WithdrawSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostWithdrawTransferResponseSchema = {
  200: Type.Object({
    channelAddress: TAddress,
    transferId: TBytes32,
    transactionHash: Type.Optional(TBytes32),
    transaction: Type.Object({
      to: TAddress,
      value: TIntegerString,
      data: Type.String(),
    }),
  }),
};

// POST SIGN UTILITY MESSAGE
const PostSignUtilityMessageBodySchema = Type.Intersect([
  EngineParams.SignUtilityMessageSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSignUtilityMessageResponseSchema = {
  200: Type.Object({
    signedMessage: Type.String(),
  }),
};

// POST RESTORE STATE
const PostRestoreStateBodySchema = Type.Intersect([
  EngineParams.RestoreStateSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostRestoreStateResponseSchema = {
  200: Type.Object({
    channelAddress: TAddress,
  }),
};

// CREATE NODE
const PostCreateNodeBodySchema = Type.Object({
  index: Type.Integer({ minimum: 0, maximum: 2147483647 }),
  mnemonic: Type.Optional(Type.String()),
  skipCheckIn: Type.Optional(Type.Boolean()),
});

const PostCreateNodeResponseSchema = {
  200: Type.Object({
    publicIdentifier: TPublicIdentifier,
    signerAddress: TAddress,
    index: Type.Integer(),
  }),
};

// ADMIN
const PostAdminBodySchema = Type.Object({
  adminToken: Type.String({
    example: "cxt1234",
    description: "Admin token",
  }),
});

const PostAdminResponseSchema = {
  200: Type.Object({
    message: Type.String(),
  }),
};

// SPEED UP TX
const PostAdminSpeedUpTxBodySchema = Type.Intersect([
  PostAdminBodySchema,
  Type.Object({ transactionHash: Type.String(), publicIdentifier: TPublicIdentifier }),
]);

const PostAdminSpeedUpTxResponseSchema = {
  200: Type.Object({
    transactionHash: Type.String(),
  }),
};

// RETRY SUBMITTING WITHDRAWAL TRANSACTION
const PostAdminRetryWithdrawTransactionBodySchema = Type.Object({
  adminToken: Type.String(),
  transferId: TBytes32,
});

const PostAdminRetryWithdrawTransactionResponseSchema = {
  200: Type.Object({
    transferId: TBytes32,
    transactionHash: Type.String(),
  }),
};

// SUBMIT UNSUBMITTED WITHDRAWALS
const PostAdminSubmitWithdrawalsBodySchema = Type.Object({
  adminToken: Type.String(),
});

// returns an object keyed on public identifiers with either
// an error json or a successful submission result
const PostAdminSubmitWithdrawalsResponseSchema = {
  200: Type.Dict(
    Type.Union([
      Type.Array(
        Type.Object({
          transactionHash: Type.String(),
          transferId: TBytes32,
          channelAddress: TAddress,
        }),
      ),
      Type.Object({
        message: Type.String(),
        type: Type.String(),
        context: Type.Dict(Type.Any()),
        stack: Type.String(),
      }),
    ]),
  ),
};

//////////////////
/// Dispute Methods

// GET CHANNEL DISPUTE
const GetChannelDisputeParamsSchema = Type.Intersect([
  EngineParams.GetChannelDisputeSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetChannelDisputeResponseSchema = {
  200: Type.Union([Type.Undefined(), ChannelDisputeSchema]),
};

// DISPUTE CHANNEL
const PostSendDisputeChannelTxBodySchema = Type.Intersect([
  EngineParams.DisputeChannelSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSendDisputeChannelTxResponseSchema = {
  200: Type.Object({
    transactionHash: TBytes32,
  }),
};

// DEFUND CHANNEL
const PostSendDefundChannelTxBodySchema = Type.Intersect([
  EngineParams.DefundChannelSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSendDefundChannelTxResponseSchema = {
  200: Type.Object({
    transactionHash: TBytes32,
  }),
};

// GET TRANSFER DISPUTE
const GetTransferDisputeParamsSchema = Type.Intersect([
  EngineParams.GetTransferDisputeSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const GetTransferDisputeResponseSchema = {
  200: Type.Union([Type.Undefined(), TransferDisputeSchema]),
};

// DISPUTE TRANSFER
const PostSendDisputeTransferTxBodySchema = Type.Intersect([
  EngineParams.DisputeTransferSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSendDisputeTransferTxResponseSchema = {
  200: Type.Object({
    transactionHash: TBytes32,
  }),
};

// DEFUND TRANSFER
const PostSendDefundTransferTxBodySchema = Type.Intersect([
  EngineParams.DefundTransferSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSendDefundTransferTxResponseSchema = {
  200: Type.Object({
    transactionHash: TBytes32,
  }),
};

// EXIT CHANNEL
const PostSendExitChannelTxBodySchema = Type.Intersect([
  EngineParams.ExitChannelSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSendExitChannelTxResponseSchema = {
  200: Type.Array(
    Type.Object({
      assetId: TAddress,
      transactionHash: Type.Optional(TBytes32),
      error: Type.Optional(TVectorErrorJson),
    }),
  ),
};

// IS ALIVE
const PostSendIsAliveBodySchema = Type.Intersect([
  EngineParams.SendIsAliveSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostSendIsAliveResponseSchema = {
  200: Type.Object({
    channelAddress: TAddress,
  }),
};

// POST RUN AUCTION
const PostRunAuctionBodySchema = Type.Intersect([
  EngineParams.RunAuctionSchema,
  Type.Object({ publicIdentifier: TPublicIdentifier }),
]);

const PostRunAuctionResponseSchema = {
  200: Type.Object({
    routerPublicIdentifier: TPublicIdentifier,
    swapRate: TIntegerString,
    totalFee: TIntegerString,
  }),
};

// Namespace exports
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NodeParams {
  export const GetStatusSchema = Type.Object({});
  export type GetStatus = Static<typeof GetStatusSchema>;

  export const WithdrawalQuoteSchema = PostWithdrawalQuoteParamsSchema;
  export type WithdrawalQuote = Static<typeof PostWithdrawalQuoteParamsSchema>;

  export const TransferQuoteSchema = PostTransferQuoteParamsSchema;
  export type TransferQuote = Static<typeof PostTransferQuoteParamsSchema>;

  export const GetRouterConfigSchema = GetRouterConfigParamsSchema;
  export type GetRouterConfig = Static<typeof GetRouterConfigParamsSchema>;

  export const GetTransferStateByRoutingIdSchema = GetTransferStateByRoutingIdParamsSchema;
  export type GetTransferStateByRoutingId = Static<typeof GetTransferStateByRoutingIdParamsSchema>;

  export const GetTransferStatesByRoutingIdSchema = GetTransferStatesByRoutingIdParamsSchema;
  export type GetTransferStatesByRoutingId = Static<typeof GetTransferStatesByRoutingIdParamsSchema>;

  export const GetTransferStateSchema = GetTransferStateParamsSchema;
  export type GetTransferState = Static<typeof GetTransferStateParamsSchema>;

  export const GetTransfersSchema = GetTransfersParamsSchema;
  export type GetTransfers = Static<typeof GetTransfersParamsSchema>;

  export const GetActiveTransfersByChannelAddressSchema = GetActiveTransfersByChannelAddressParamsSchema;
  export type GetActiveTransfersByChannelAddress = Static<typeof GetActiveTransfersByChannelAddressParamsSchema>;

  export const GetChannelStateSchema = GetChannelStateParamsSchema;
  export type GetChannelState = Static<typeof GetChannelStateSchema>;

  export const GetChannelStatesSchema = GetChannelStatesParamsSchema;
  export type GetChannelStates = Static<typeof GetChannelStatesSchema>;

  export const GetChannelStateByParticipantsSchema = GetChannelStateByParticipantsParamsSchema;
  export type GetChannelStateByParticipants = Static<typeof GetChannelStateByParticipantsSchema>;

  export const GetListenerSchema = GetListenerParamsSchema;
  export type GetListener = Static<typeof GetListenerSchema>;

  export const GetListenersSchema = GetListenersParamsSchema;
  export type GetListeners = Static<typeof GetListenersSchema>;

  export const GetRegisteredTransfersSchema = GetRegisteredTransfersParamsSchema;
  export type GetRegisteredTransfers = Static<typeof GetRegisteredTransfersSchema>;

  export const GetWithdrawalCommitmentSchema = GetWithdrawalCommitmentParamsSchema;
  export type GetWithdrawalCommitment = Static<typeof GetWithdrawalCommitmentSchema>;

  export const GetWithdrawalCommitmentByTransactionHashSchema = GetWithdrawalCommitmentByTransactionHashParamsSchema;
  export type GetWithdrawalCommitmentByTransactionHash = Static<typeof GetWithdrawalCommitmentByTransactionHashSchema>;

  export const GetConfigSchema = Type.Object({});
  export type GetConfig = Static<typeof GetConfigSchema>;

  export const SetupSchema = PostSetupBodySchema;
  export type Setup = Static<typeof SetupSchema>;

  export const RequestSetupSchema = PostRequestSetupBodySchema;
  export type RequestSetup = Static<typeof RequestSetupSchema>;

  export const DepositSchema = PostDepositBodySchema;
  export type Deposit = Static<typeof DepositSchema>;

  export const RequestCollateralSchema = PostRequestCollateralBodySchema;
  export type RequestCollateral = Static<typeof RequestCollateralSchema>;

  export const SendDepositTxSchema = PostSendDepositTxBodySchema;
  export type SendDepositTx = Static<typeof SendDepositTxSchema>;

  export const ConditionalTransferSchema = PostConditionalTransferBodySchema;
  export type ConditionalTransfer = Static<typeof ConditionalTransferSchema>;

  export const ResolveTransferSchema = PostResolveTransferBodySchema;
  export type ResolveTransfer = Static<typeof ResolveTransferSchema>;

  export const WithdrawSchema = PostWithdrawTransferBodySchema;
  export type Withdraw = Static<typeof WithdrawSchema>;

  export const RegisterListenerSchema = PostRegisterListenerBodySchema;
  export type RegisterListener = Static<typeof RegisterListenerSchema>;

  export const SignUtilityMessageSchema = PostSignUtilityMessageBodySchema;
  export type SignUtilityMessage = Static<typeof SignUtilityMessageSchema>;

  export const RestoreStateSchema = PostRestoreStateBodySchema;
  export type RestoreState = Static<typeof RestoreStateSchema>;

  export const AdminSchema = PostAdminBodySchema;
  export type Admin = Static<typeof AdminSchema>;

  export const SpeedUpTxSchema = PostAdminSpeedUpTxBodySchema;
  export type SpeedUpTx = Static<typeof SpeedUpTxSchema>;

  export const CreateNodeSchema = PostCreateNodeBodySchema;
  export type CreateNode = Static<typeof CreateNodeSchema>;

  export const GetChannelDisputeSchema = GetChannelDisputeParamsSchema;
  export type GetChannelDispute = Static<typeof GetChannelDisputeSchema>;

  export const SendDisputeChannelTxSchema = PostSendDisputeChannelTxBodySchema;
  export type SendDisputeChannelTx = Static<typeof SendDisputeChannelTxSchema>;

  export const SendDefundChannelTxSchema = PostSendDefundChannelTxBodySchema;
  export type SendDefundChannelTx = Static<typeof SendDefundChannelTxSchema>;

  export const GetTransferDisputeSchema = GetTransferDisputeParamsSchema;
  export type GetTransferDispute = Static<typeof GetTransferDisputeSchema>;

  export const SendDisputeTransferTxSchema = PostSendDisputeTransferTxBodySchema;
  export type SendDisputeTransferTx = Static<typeof SendDisputeTransferTxSchema>;

  export const SendDefundTransferTxSchema = PostSendDefundTransferTxBodySchema;
  export type SendDefundTransferTx = Static<typeof SendDefundTransferTxSchema>;

  export const SendExitChannelTxSchema = PostSendExitChannelTxBodySchema;
  export type SendExitChannelTx = Static<typeof SendExitChannelTxSchema>;

  export const SendIsAliveSchema = PostSendIsAliveBodySchema;
  export type SendIsAlive = Static<typeof SendIsAliveSchema>;

  export const RetryWithdrawTransactionSchema = PostAdminRetryWithdrawTransactionBodySchema;
  export type RetryWithdrawTransaction = Static<typeof RetryWithdrawTransactionSchema>;

  export const SubmitWithdrawalsSchema = PostAdminSubmitWithdrawalsBodySchema;
  export type SubmitWithdrawals = Static<typeof SubmitWithdrawalsSchema>;

  export const RunAuctionSchema = PostRunAuctionBodySchema;
  export type RunAuction = Static<typeof RunAuctionSchema>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NodeResponses {
  export const WithdrawalQuoteSchema = PostWithdrawalQuoteResponseSchema;
  export type WithdrawalQuote = Static<typeof PostWithdrawalQuoteResponseSchema["200"]>;

  export const TransferQuoteSchema = PostTransferQuoteResponseSchema;
  export type TransferQuote = Static<typeof PostTransferQuoteResponseSchema["200"]>;

  export const GetRouterConfigSchema = GetRouterConfigResponseSchema;
  export type GetRouterConfig = Static<typeof GetRouterConfigResponseSchema["200"]>;

  export const GetTransferStateByRoutingIdSchema = GetTransferStateByRoutingIdResponseSchema;
  export type GetTransferStateByRoutingId = Static<typeof GetTransferStateByRoutingIdResponseSchema["200"]>;

  export const GetTransferStatesByRoutingIdSchema = GetTransferStatesByRoutingIdResponseSchema;
  export type GetTransferStatesByRoutingId = Static<typeof GetTransferStatesByRoutingIdResponseSchema["200"]>;

  export const GetTransferStateSchema = GetTransferStateResponseSchema;
  export type GetTransferState = Static<typeof GetTransferStateResponseSchema>;

  export const GetTransfersSchema = GetTransfersResponseSchema;
  export type GetTransfers = Static<typeof GetTransfersResponseSchema>;

  export const GetActiveTransfersByChannelAddressSchema = GetActiveTransfersByChannelAddressResponseSchema;
  export type GetActiveTransfersByChannelAddress = Static<
    typeof GetActiveTransfersByChannelAddressResponseSchema["200"]
  >;

  export const GetChannelStateSchema = GetChannelStateResponseSchema;
  export type GetChannelState = Static<typeof GetChannelStateSchema["200"]>;

  export const GetChannelStateByParticipantsSchema = GetChannelStateByParticipantsResponseSchema;
  export type GetChannelStateByParticipants = Static<typeof GetChannelStateByParticipantsSchema["200"]>;

  export const GetChannelStatesSchema = GetChannelStatesResponseSchema;
  export type GetChannelStates = Static<typeof GetChannelStatesSchema["200"]>;

  export const GetListenerSchema = GetListenerResponseSchema;
  export type GetListener = Static<typeof GetListenerSchema["200"]>;

  export const GetListenersSchema = GetListenersResponseSchema;
  export type GetListeners = Static<typeof GetListenersSchema["200"]>;

  export const GetConfigSchema = GetConfigResponseSchema;
  export type GetConfig = Static<typeof GetConfigSchema["200"]>;

  export const GetStatusSchema = GetStatusResponseSchema;
  export type GetStatus = Static<typeof GetStatusSchema["200"]>;

  export const GetRegisteredTransfersSchema = GetRegisteredTransfersResponseSchema;
  export type GetRegisteredTransfers = Static<typeof GetRegisteredTransfersSchema["200"]>;

  export const GetWithdrawalCommitmentSchema = GetWithdrawalCommitmentResponseSchema;
  export type GetWithdrawalCommitment = Static<typeof GetWithdrawalCommitmentSchema["200"]>;

  export const GetWithdrawalCommitmentByTransactionHashSchema = GetWithdrawalCommitmentByTransactionHashResponseSchema;
  export type GetWithdrawalCommitmentByTransactionHash = Static<
    typeof GetWithdrawalCommitmentByTransactionHashSchema["200"]
  >;

  export const SetupSchema = PostSetupResponseSchema;
  export type Setup = Static<typeof SetupSchema["200"]>;

  export const RequestSetupSchema = PostRequestSetupResponseSchema;
  export type RequestSetup = Static<typeof RequestSetupSchema["200"]>;

  export const DepositSchema = PostDepositResponseSchema;
  export type Deposit = Static<typeof DepositSchema["200"]>;

  export const RequestCollateralSchema = PostRequestCollateralResponseSchema;
  export type RequestCollateral = Static<typeof RequestCollateralSchema["200"]>;

  export const SendDepositTxSchema = PostSendDepositTxResponseSchema;
  export type SendDepositTx = Static<typeof SendDepositTxSchema["200"]>;

  export const ConditionalTransferSchema = PostConditionalTransferResponseSchema;
  export type ConditionalTransfer = Static<typeof ConditionalTransferSchema["200"]>;

  export const ResolveTransferSchema = PostResolveTransferResponseSchema;
  export type ResolveTransfer = Static<typeof ResolveTransferSchema["200"]>;

  export const WithdrawSchema = PostWithdrawTransferResponseSchema;
  export type Withdraw = Static<typeof WithdrawSchema["200"]>;

  export const RegisterListenerSchema = PostRegisterListenerResponseSchema;
  export type RegisterListener = Static<typeof RegisterListenerSchema["200"]>;

  export const SignUtilityMessageSchema = PostSignUtilityMessageResponseSchema;
  export type SignUtilityMessage = Static<typeof SignUtilityMessageSchema["200"]>;

  export const RestoreStateSchema = PostRestoreStateResponseSchema;
  export type RestoreState = Static<typeof RestoreStateSchema["200"]>;

  export const AdminSchema = PostAdminResponseSchema;
  export type Admin = Static<typeof AdminSchema["200"]>;

  export const SpeedUpTxSchema = PostAdminSpeedUpTxResponseSchema;
  export type SpeedUpTx = Static<typeof PostAdminSpeedUpTxResponseSchema["200"]>;

  export const CreateNodeSchema = PostCreateNodeResponseSchema;
  export type CreateNode = Static<typeof CreateNodeSchema["200"]>;

  export const GetChannelDisputeSchema = GetChannelDisputeResponseSchema;
  export type GetChannelDispute = Static<typeof GetChannelDisputeResponseSchema["200"]>;

  export const SendDisputeChannelTxSchema = PostSendDisputeChannelTxResponseSchema;
  export type SendDisputeChannelTx = Static<typeof PostSendDisputeChannelTxResponseSchema["200"]>;

  export const SendDefundChannelTxSchema = PostSendDefundChannelTxResponseSchema;
  export type SendDefundChannelTx = Static<typeof PostSendDefundChannelTxResponseSchema["200"]>;

  export const GetTransferDisputeSchema = GetTransferDisputeResponseSchema;
  export type GetTransferDispute = Static<typeof GetTransferDisputeResponseSchema["200"]>;

  export const SendDisputeTransferTxSchema = PostSendDisputeTransferTxResponseSchema;
  export type SendDisputeTransferTx = Static<typeof PostSendDisputeTransferTxResponseSchema["200"]>;

  export const SendDefundTransferTxSchema = PostSendDefundTransferTxResponseSchema;
  export type SendDefundTransferTx = Static<typeof PostSendDefundTransferTxResponseSchema["200"]>;

  export const SendExitChannelTxSchema = PostSendExitChannelTxResponseSchema;
  export type SendExitChannelTx = Static<typeof PostSendExitChannelTxResponseSchema["200"]>;

  export const SendIsAliveSchema = PostSendIsAliveResponseSchema;
  export type SendIsAlive = Static<typeof PostSendIsAliveResponseSchema["200"]>;

  export const RetryWithdrawTransactionSchema = PostAdminRetryWithdrawTransactionResponseSchema;
  export type RetryWithdrawTransaction = Static<typeof PostAdminRetryWithdrawTransactionResponseSchema["200"]>;

  export const SubmitWithdrawalsSchema = PostAdminSubmitWithdrawalsResponseSchema;
  export type SubmitWithdrawals = Static<typeof PostAdminSubmitWithdrawalsResponseSchema["200"]>;

  export const RunAuctionSchema = PostRunAuctionResponseSchema;
  export type RunAuction = Static<typeof RunAuctionSchema["200"]>;
}
