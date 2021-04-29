import { Values, RouterError, RouterErrorContext } from "@connext/vector-types";

import { RebalanceProfile } from "./config";

export type CollateralErrorContext = RouterErrorContext & {
  channelAddress: string;
  assetId: string;
  profile: RebalanceProfile;
  requested?: string;
};
export class CollateralError extends RouterError {
  static readonly type = "CollateralError";

  static readonly reasons = {
    ChannelNotFound: "Channel not found",
    CouldNotGetOnchainDeposits: "Unable to get total deposited onchain",
    NodeError: "Node method failed",
    NotInChannel: "Router is not found in channel",
    ProviderNotFound: "Provider not found",
    UnableToGetRebalanceProfile: "Could not get rebalance profile",
    TargetHigherThanThreshold: "Specified target is higher than reclaim threshold",
    TxError: "Error sending deposit transaction",
    UnableToCollateralize: "Could not collateralize channel",
    UnableToReclaim: "Could not reclaim collateral from channel",
  } as const;

  readonly context: CollateralErrorContext;

  constructor(
    public readonly message: Values<typeof CollateralError.reasons>,
    channelAddress: string,
    assetId: string,
    profile: RebalanceProfile,
    requested?: string,
    context: any = {},
  ) {
    super(message, { channelAddress, assetId, profile, requested, ...context }, CollateralError.type);
  }
}

export type SwapErrorContext = RouterErrorContext & {
  fromAmount: string;
  fromAssetId: string;
  fromChainId: number;
  toAssetId: string;
  toChainId: number;
};
export class SwapError extends RouterError {
  static readonly type = "SwapError";

  static readonly reasons = {
    SwapNotAllowed: "Swap is not configured in allowed swaps",
    SwapNotHardcoded: "Swap rate must be hardcoded",
  } as const;

  readonly context: SwapErrorContext;

  constructor(
    public readonly message: Values<typeof SwapError.reasons>,
    fromAmount: string,
    fromAssetId: string,
    fromChainId: number,
    toAssetId: string,
    toChainId: number,
    context: any = {},
  ) {
    super(message, { fromAmount, fromAssetId, fromChainId, toAssetId, toChainId, ...context }, SwapError.type);
  }
}

export type ForwardTransferCreationErrorContext = RouterErrorContext & {
  routingId: string;
  senderChannel: string;
  senderTransfer: string;
  receiverChannel: string;
};
export class ForwardTransferCreationError extends RouterError {
  static readonly type = "ForwardTransferCreationError";

  static readonly reasons = {
    SenderChannelNotFound: "Sender channel not found",
    RecipientChannelNotFound: "Recipient channel not found",
    UnableToCalculateSwap: "Could not calculate swap",
    ErrorForwardingTransfer: "Error forwarding transfer",
    ErrorQueuingReceiverUpdate: "Unable to queue update for receiver retry",
    InvalidForwardingInfo: "Invalid information to forward transfer within meta",
    UnableToCollateralize: "Could not collateralize receiver channel",
    InvalidTransferDefinition: "Could not find transfer definition",
    StoredUpdateError: "Error in stored update",
    ReceiverOffline: "Recipient was not online, could not forward",
    FailedToCancelSenderTransfer: "Could not cancel sender transfer",
    FeeError: "Could not calculate fee",
    ConfigError: "Error with config",
    QuoteError: "Error with provided quote",
  } as const;

  readonly context: ForwardTransferCreationErrorContext;

  constructor(
    public readonly message: Values<typeof ForwardTransferCreationError.reasons>,
    routingId: string,
    senderChannel: string,
    senderTransfer: string,
    receiverChannel: string,
    context: any = {},
  ) {
    super(
      message,
      {
        routingId,
        senderChannel,
        senderTransfer,
        receiverChannel,
        ...context,
      },
      ForwardTransferCreationError.type,
    );
  }
}

export type ForwardTransferResolutionErrorContext = ForwardTransferCreationErrorContext & { receiverTransfer: string };
export class ForwardTransferResolutionError extends RouterError {
  static readonly type = "ForwardTransferResolutionError";

  static readonly reasons = {
    IncomingChannelNotFound: "Incoming channel for transfer not found",
    ErrorResolvingTransfer: "Error resolving transfer",
  } as const;

  readonly context: ForwardTransferResolutionErrorContext;

  constructor(
    public readonly message: Values<typeof ForwardTransferResolutionError.reasons>,
    routingId: string,
    senderChannel: string,
    senderTransfer: string,
    receiverChannel: string,
    receiverTransfer: string,
    context: any = {},
  ) {
    super(
      message,
      { routingId, senderChannel, senderTransfer, receiverChannel, receiverTransfer, ...context },
      ForwardTransferResolutionError.type,
    );
  }
}

export type CheckInErrorContext = RouterErrorContext;
export class CheckInError extends RouterError {
  static readonly type = "CheckInError";

  static readonly reasons = {
    CouldNotGetActiveTransfers: "Failed to get active transfers",
    CouldNotGetChannel: "Could not get channel, or not found",
    CouldNotGetRegistryInfo: "Could not get transfer registry information",
    RouterCleanupFailed: "Could not handle all dropped transfers",
    StoreFailed: "Store method failed",
    TasksFailed: "Router couldn't complete all check-in tasks",
    UpdatesFailed: "Could not forward all updates",
  } as const;

  readonly context: CheckInErrorContext;

  constructor(public readonly message: Values<typeof CheckInError.reasons>, channelAddress: string, context: any = {}) {
    super(message, { channelAddress, ...context }, CheckInError.type);
  }
}

export type ConfigServiceErrorContext = RouterErrorContext & {
  chainId: number;
  assetId: string;
};
export class ConfigServiceError extends RouterError {
  static readonly type = "ConfigServiceError";

  static readonly reasons = {
    CouldNotGetAssetBalance: "Could not get asset balance",
    RouterMaxSafePriceImpact: "price Impact is too high for Router",
    UnableToGetSwapRate: "Could not get swap rate",
    UnableToGetRebalanceProfile: "Could not get rebalance profile",
    UnableToFindSwap: "Could not get matching swap",
  } as const;

  readonly context: ConfigServiceErrorContext;

  constructor(public readonly message: Values<typeof ConfigServiceError.reasons>, context: any = {}) {
    super(message, context, ConfigServiceError.type);
  }
}

export type AutoRebalanceServiceErrorContext = RouterErrorContext & {
  chainId: number;
  assetId: string;
};
export class AutoRebalanceServiceError extends RouterError {
  static readonly type = "AutoRebalanceServiceError";

  static readonly reasons = {
    CouldNotGetAssetBalance: "Could not get asset balance",
    CouldNotCompleteApproval: "Could not complete approval",
    CouldNotExecuteRebalance: "Could not execute rebalance",
    CouldNotCompleteRebalance: "Could not complete rebalance",
    ExecutedWithoutHash: "Rebalance status is 'executed' but no execution hash found",
  } as const;

  readonly context: AutoRebalanceServiceErrorContext;

  constructor(
    public readonly message: Values<typeof AutoRebalanceServiceError.reasons>,
    chainId: number,
    assetId: string,
    context: any = {},
  ) {
    super(message, { chainId, assetId, ...context }, AutoRebalanceServiceError.type);
  }
}

export class ServerError extends RouterError {
  static readonly type = "ServerError";

  static readonly reasons = {
    Unauthorized: "Unauthorized",
  } as const;

  constructor(public readonly message: Values<typeof ServerError.reasons>, context: any = {}) {
    super(message, context, ServerError.type);
  }
}

export class FeeError extends RouterError {
  static readonly type = "FeeError";

  static readonly reasons = {
    NoSwap: "Could not find swap",
    ChainError: "Error reading the chain",
    ChannelError: "Error retrieving channel info",
    ConfigError: "Error retrieving config info",
    ConversionError: "Error converting assets",
    ExchangeRateError: "Error getting exchange rate",
    FeesLargerThanAmount: "Fees are greater than the proposed transfer",
    AmmError: "Error getting AMM rate",
  } as const;

  constructor(public readonly message: Values<typeof FeeError.reasons>, context: any = {}) {
    super(message, context, FeeError.type);
  }
}

export class QuoteError extends RouterError {
  static readonly type = "QuoteError";

  static readonly reasons = {
    ChainNotSupported: "Chain is not supported",
    CouldNotGetChannel: "Error retrieving channels",
    CouldNotGetChannelAddress: "Failed to calculate channel address",
    CouldNotGetFee: "Failed to get fee for transfer",
    CouldNotSignQuote: "Failed to sign transfer quote",
    TransferNotSupported: "Proposed transfer not supported",
  } as const;

  constructor(public readonly message: Values<typeof QuoteError.reasons>, context: any = {}) {
    super(message, context, FeeError.type);
  }
}
