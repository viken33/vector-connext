import { Address, Bytes32 } from "./basic";
import { Balance, FullTransferState } from "./channel";
import { EngineParams } from "./schemas";
import { TransferName } from "./transferDefinitions";
import { ChannelRpcMethod, ChannelRpcMethodsResponsesMap } from "./vectorProvider";
import { ChainServiceEventMap, ChainServiceEvents } from "./event";
import { MinimalTransaction } from "./chain";

///////////////////////////////////
////// Engine transfer types
export type ConditionalTransferResponse = {
  routingId: Bytes32;
};

///////////////////////////////////
////// Engine event types
// Emitted on startup
export const IS_ALIVE_EVENT = "IS_ALIVE";
export type IsAlivePayload = {
  channelAddress: string;
  aliceIdentifier: string;
  bobIdentifier: string;
  chainId: number;
  skipCheckIn?: boolean;
};

// Emitted on channel setup
export const SETUP_EVENT = "SETUP";
export type SetupPayload = {
  channelAddress: string;
  aliceIdentifier: string;
  bobIdentifier: string;
  chainId: number;
  meta?: any;
};

// Emitted when transfer created
export const CONDITIONAL_TRANSFER_CREATED_EVENT = "CONDITIONAL_TRANSFER_CREATED";
export type ConditionalTransferCreatedPayload = {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  transfer: FullTransferState;
  channelBalance: Balance;
  conditionType: TransferName | Address;
  activeTransferIds?: string[];
};

// Emitted when transfer resolved
export const CONDITIONAL_TRANSFER_RESOLVED_EVENT = "CONDITIONAL_TRANSFER_RESOLVED";
export type ConditionalTransferResolvedPayload = ConditionalTransferCreatedPayload;

// Emitted when transfer forwarded by router
export const CONDITIONAL_TRANSFER_ROUTING_COMPLETE_EVENT = "CONDITIONAL_TRANSFER_ROUTING_COMPLETE";
export type ConditionalTransferRoutingCompletePayload = {
  publicIdentifier: string;
  routingId: string;
  initiatorIdentifier: string;
  responderIdentifier: string;
  meta?: any;
};

// Emitted when an onchain deposit is reconciled with offchain balance
export const DEPOSIT_RECONCILED_EVENT = "DEPOSIT_RECONCILED";
export type DepositReconciledPayload = {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  assetId: string;
  channelBalance: Balance;
  meta?: any;
};

// Emitted when a counterparty requests collateral
export const REQUEST_COLLATERAL_EVENT = "REQUEST_COLLATERAL";
export type RequestCollateralPayload = {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  assetId: string;
  amount?: string;
  meta?: any;
};

// Emitted when a withdrawal transfer is created
export const WITHDRAWAL_CREATED_EVENT = "WITHDRAWAL_CREATED";
export type WithdrawalCreatedPayload = {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  transfer: FullTransferState;
  fee: string;
  assetId: string;
  amount: string;
  recipient: string;
  callTo: string;
  callData: string;
  channelBalance: Balance;
};

// Emitted when a withdrawal transfer is resolved
export const WITHDRAWAL_RESOLVED_EVENT = "WITHDRAWAL_RESOLVED";
export type WithdrawalResolvedPayload = WithdrawalCreatedPayload & { transaction?: MinimalTransaction };

// Emitted when withdrawal commitment is submitted to chain
export const WITHDRAWAL_RECONCILED_EVENT = "WITHDRAWAL_RECONCILED";
export type WithdrawalReconciledPayload = {
  aliceIdentifier: string;
  bobIdentifier: string;
  channelAddress: string;
  transactionHash: string;
  transferId: string;
  meta?: any;
};

// Emitted on channel restore
export const RESTORE_STATE_EVENT = "RESTORE_STATE_EVENT";
export type RestoreStatePayload = SetupPayload;

// Emitted on Auction
export const RUN_AUCTION_EVENT = "RUN_AUCTION_EVENT";
export type RunAuctionPayload = {
  amount: string;
  senderPublicIdentifier: string;
  senderAssetId: string;
  senderChainId: number;
  receiverPublicIdentifier: string;
  receiverAssetId: string;
  receiverChainId: number;
};

// Grouped event types
export const EngineEvents = {
  [IS_ALIVE_EVENT]: IS_ALIVE_EVENT,
  [SETUP_EVENT]: SETUP_EVENT,
  [CONDITIONAL_TRANSFER_CREATED_EVENT]: CONDITIONAL_TRANSFER_CREATED_EVENT,
  [CONDITIONAL_TRANSFER_RESOLVED_EVENT]: CONDITIONAL_TRANSFER_RESOLVED_EVENT,
  [CONDITIONAL_TRANSFER_ROUTING_COMPLETE_EVENT]: CONDITIONAL_TRANSFER_ROUTING_COMPLETE_EVENT,
  [DEPOSIT_RECONCILED_EVENT]: DEPOSIT_RECONCILED_EVENT,
  [REQUEST_COLLATERAL_EVENT]: REQUEST_COLLATERAL_EVENT,
  [RESTORE_STATE_EVENT]: RESTORE_STATE_EVENT,
  [SETUP_EVENT]: SETUP_EVENT,
  [WITHDRAWAL_CREATED_EVENT]: WITHDRAWAL_CREATED_EVENT,
  [WITHDRAWAL_RESOLVED_EVENT]: WITHDRAWAL_RESOLVED_EVENT,
  [WITHDRAWAL_RECONCILED_EVENT]: WITHDRAWAL_RECONCILED_EVENT,
  [RUN_AUCTION_EVENT]: RUN_AUCTION_EVENT,
  ...ChainServiceEvents,
} as const;
export type EngineEvent = typeof EngineEvents[keyof typeof EngineEvents];
export interface EngineEventMap extends ChainServiceEventMap {
  [IS_ALIVE_EVENT]: IsAlivePayload;
  [SETUP_EVENT]: SetupPayload;
  [CONDITIONAL_TRANSFER_CREATED_EVENT]: ConditionalTransferCreatedPayload;
  [CONDITIONAL_TRANSFER_RESOLVED_EVENT]: ConditionalTransferResolvedPayload;
  [CONDITIONAL_TRANSFER_ROUTING_COMPLETE_EVENT]: ConditionalTransferRoutingCompletePayload;
  [DEPOSIT_RECONCILED_EVENT]: DepositReconciledPayload;
  [REQUEST_COLLATERAL_EVENT]: RequestCollateralPayload;
  [RESTORE_STATE_EVENT]: RestoreStatePayload;
  [SETUP_EVENT]: SetupPayload;
  [WITHDRAWAL_CREATED_EVENT]: WithdrawalCreatedPayload;
  [WITHDRAWAL_RESOLVED_EVENT]: WithdrawalResolvedPayload;
  [WITHDRAWAL_RECONCILED_EVENT]: WithdrawalReconciledPayload;
  [RUN_AUCTION_EVENT]: RunAuctionPayload;
  // Add public identifiers to transaction events
  [ChainServiceEvents.TRANSACTION_SUBMITTED]: ChainServiceEventMap[typeof ChainServiceEvents.TRANSACTION_SUBMITTED] & {
    publicIdentifier: string;
  };
  [ChainServiceEvents.TRANSACTION_MINED]: ChainServiceEventMap[typeof ChainServiceEvents.TRANSACTION_MINED] & {
    publicIdentifier: string;
  };
  [ChainServiceEvents.TRANSACTION_FAILED]: ChainServiceEventMap[typeof ChainServiceEvents.TRANSACTION_FAILED] & {
    publicIdentifier: string;
  };
  [ChainServiceEvents.CHANNEL_DISPUTED]: ChainServiceEventMap[typeof ChainServiceEvents.CHANNEL_DISPUTED] & {
    publicIdentifier: string;
  };
  [ChainServiceEvents.CHANNEL_DEFUNDED]: ChainServiceEventMap[typeof ChainServiceEvents.CHANNEL_DEFUNDED] & {
    publicIdentifier: string;
  };
  [ChainServiceEvents.TRANSFER_DISPUTED]: ChainServiceEventMap[typeof ChainServiceEvents.TRANSFER_DISPUTED] & {
    publicIdentifier: string;
  };
  [ChainServiceEvents.TRANSFER_DEFUNDED]: ChainServiceEventMap[typeof ChainServiceEvents.TRANSFER_DEFUNDED] & {
    publicIdentifier: string;
  };
}

///////////////////////////////////
////// Core engine interfaces
export interface IVectorEngine {
  publicIdentifier: string;
  signerAddress: string;
  request<T extends ChannelRpcMethod>(payload: EngineParams.RpcRequest): Promise<ChannelRpcMethodsResponsesMap[T]>;
  on<T extends EngineEvent>(
    event: T,
    callback: (payload: EngineEventMap[T]) => void | Promise<void>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter?: (payload: EngineEventMap[T]) => boolean,
  ): void;
  once<T extends EngineEvent>(
    event: T,
    callback: (payload: EngineEventMap[T]) => void | Promise<void>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filter?: (payload: EngineEventMap[T]) => boolean,
  ): void;
  waitFor<T extends EngineEvent>(
    event: T,
    timeout: number,
    filter?: (payload: EngineEventMap[T]) => boolean,
  ): Promise<EngineEventMap[T]>;
  off<T extends EngineEvent>(event?: T): void;
}
