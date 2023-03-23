/* @flow */
/* eslint-disable flowtype/require-exact-type */

import { ZalgoPromise } from "@krakenjs/zalgo-promise/src";
import {
  FUNDING,
  CARD,
  type FundingEligibilityType,
} from "@paypal/sdk-constants/src";

import type { ProxyWindow, FeatureFlags } from "../types";
import { getProps, type XProps, type Props } from "../props/props";
import { getSaveActionOnApprove } from "../props/onApprove";
import { getLegacyProps, type LegacyProps } from "../props/legacyProps";
import type {
  XOnApprove,
  XOnComplete,
  XOnCancel,
  XOnError,
  XOnShippingChange,
  XOnShippingAddressChange,
  XOnShippingOptionsChange,
  XCreateOrder,
  XCreateBillingAgreement,
  XCreateSubscription,
  XCreateVaultSetupToken,
  SaveActionOnApprove,
} from "../props";
import { getCreateVaultSetupToken } from "../props/createVaultSetupToken";

import type {
  CardStyle,
  CardPlaceholder,
  CardFieldsState,
  ParsedCardType,
  FieldsState,
} from "./types";
import { CARD_FIELD_TYPE, CARD_ERRORS, SUBMIT_ERRORS } from "./constants";

// export something to force webpack to see this as an ES module
export const TYPES = true;

export type PrerenderDetailsType = {|
  win?: ?ProxyWindow,
  fundingSource: $Values<typeof FUNDING>,
  card?: ?$Values<typeof CARD>,
|};

export type CardExport = ({|
  submit: () => ZalgoPromise<void>,
  getState: () => CardFieldsState,
|}) => ZalgoPromise<void>;

export type InputEventState = {|
  cards: $ReadOnlyArray<ParsedCardType>,
  emittedBy: string,
  fields: FieldsState,
  errors: [$Values<typeof CARD_ERRORS>] | [],
  isFormValid: boolean,
|};

export type OnChange = ({|
  ...InputEventState,
|}) => ZalgoPromise<void>;

export type OnBlur = (InputEventState) => ZalgoPromise<void>;

export type OnFocus = (InputEventState) => ZalgoPromise<void>;

export type OnInputSubmitRequest = (InputEventState) => ZalgoPromise<void>;

export type InputEvents = {
  onChange?: OnChange,
  onFocus?: OnFocus,
  onBlur?: OnBlur,
  onInputSubmitRequest?: OnInputSubmitRequest,
};

export type CardXProps = {|
  ...XProps,
  type: $Values<typeof CARD_FIELD_TYPE>,
  style: CardStyle,
  placeholder: CardPlaceholder,
  minLength?: number,
  maxLength?: number,
  cardSessionID: string,
  fundingEligibility: FundingEligibilityType,
  inputEvents: InputEvents,
  export: CardExport,
  parent?: {|
    props: XProps,
    export: CardExport,
  |},
  onApprove: ?XOnApprove,
  onComplete?: ?XOnComplete,
  onCancel: XOnCancel,
  onError: XOnError,
  onShippingChange: ?XOnShippingChange,
  onShippingAddressChange: ?XOnShippingAddressChange,
  onShippingOptionsChange: ?XOnShippingOptionsChange,
  createOrder: ?XCreateOrder,
  createBillingAgreement: ?XCreateBillingAgreement,
  createSubscription: ?XCreateSubscription,
  createVaultSetupToken: ?XCreateVaultSetupToken,
  hcfSessionID: string
|};

type BaseCardProps = {|
  ...Props,
  type: $Values<typeof CARD_FIELD_TYPE>,
  branded: boolean,
  style: CardStyle,
  placeholder: CardPlaceholder,
  minLength?: number,
  maxLength?: number,
  cardSessionID: string,
  fundingEligibility: FundingEligibilityType,
  export: CardExport,
  inputEvents: InputEvents,
  facilitatorAccessToken: string,
  disableAutocomplete?: boolean,
  hcfSessionID?: string
|};

export type LegacyCardProps = {|
  ...BaseCardProps,
  ...LegacyProps,
|};

export type SaveCardFieldsProps = {|
  ...BaseCardProps,
  createVaultSetupToken: XCreateVaultSetupToken,
  onApprove: SaveActionOnApprove
|}

export type CardProps = LegacyCardProps | SaveCardFieldsProps

type GetCardPropsOptions = {|
  facilitatorAccessToken: string,
  featureFlags: FeatureFlags,
|};

/**
 * These CardFields props are disallowed when createVaultSetupToken is also provided.
 * This is to prevent confusion between which flow is being used at runtime.
 */
const disallowedPropsWithSave = [
  "createOrder",
];
/**
 * When CardFields is used with createVaultSetupToken, the required properties change. This is for validating the arguments in that use-case.
 */
function validateVaultWithoutPurchaseSetup(xprops, baseProps): {| createVaultSetupToken: XCreateVaultSetupToken, onApprove: SaveActionOnApprove |} {
  disallowedPropsWithSave.forEach((prop) => {
    if (xprops[prop]) {
      throw new Error(`Do not pass ${prop} with an action.`);
    }
  });

  // this if check is really for Flow so that later it knows this function is defined
  if (!xprops?.createVaultSetupToken) {
      throw new Error("createVaultSetupToken is required when saving card fields");
  }

  if (!xprops?.onApprove) {
      throw new Error("onApprove is required when saving card fields");
  }

  return {
    createVaultSetupToken: getCreateVaultSetupToken({
      createVaultSetupToken: xprops.createVaultSetupToken,
    }),
      // $FlowIssue we have an issue with xprops.onApprove but we need a larger refactor to fix this
    onApprove: getSaveActionOnApprove({
      // $FlowIssue
      onApprove: xprops.onApprove,
      onError: baseProps.onError,
    }),
  };
}

export function getCardProps({
  facilitatorAccessToken,
  featureFlags,
}: GetCardPropsOptions): LegacyCardProps | SaveCardFieldsProps {
  const xprops: CardXProps = window.xprops;

  const {
    type,
    cardSessionID,
    style,
    placeholder,
    minLength,
    maxLength,
    fundingEligibility,
    inputEvents,
    branded = fundingEligibility?.card?.branded ?? true,
    parent,
    export: xport,
    createVaultSetupToken,
    createOrder,
    sdkCorrelationID,
    partnerAttributionID,
    hcfSessionID
  } = xprops;

  const returnData = {
    type,
    branded,
    style,
    placeholder,
    minLength,
    maxLength,
    cardSessionID,
    fundingEligibility,
    inputEvents,
    export: parent ? parent.export : xport,
    facilitatorAccessToken,
    sdkCorrelationID,
    partnerAttributionID,
    hcfSessionID,
  };

  const baseProps = getProps({ branded });

  if (createVaultSetupToken && createOrder) {
    throw new Error(SUBMIT_ERRORS.PASSING_BOTH_FUNCTIONS);
  } else if (createVaultSetupToken) {
    return {
      ...baseProps,
      ...validateVaultWithoutPurchaseSetup(xprops, baseProps),
      ...returnData,
    };
  } else if (createOrder) {
    // $FlowFixMe
    const props = getLegacyProps({
      paymentSource: null,
      partnerAttributionID: xprops.partnerAttributionID,
      merchantID: xprops.merchantID,
      clientID: xprops.clientID,
      currency: xprops.currency,
      intent: xprops.intent,
      clientAccessToken: xprops.clientAccessToken,
      branded,
      vault: false,
      facilitatorAccessToken,
      featureFlags,
      onShippingChange: xprops.onShippingChange,
      onShippingAddressChange: xprops.onShippingAddressChange,
      onShippingOptionsChange: xprops.onShippingOptionsChange,
      onError: baseProps.onError,
      onCancel: xprops.onCancel,
      onApprove: xprops.onApprove,
      createSubscription: xprops.createSubscription,
      createOrder: xprops.createOrder,
      createBillingAgreement: xprops.createBillingAgreement,
    });

    // $FlowFixMe
    return {
      ...baseProps,
      ...props,
      type,
      branded,
      style,
      placeholder,
      // $FlowFixMe
      onApprove: xprops.onApprove,
      // $FlowFixMe
      createOrder: xprops.createOrder,
      onError: xprops.onError,
      minLength,
      maxLength,
      cardSessionID,
      fundingEligibility,
      inputEvents,
      export: parent ? parent.export : xport,
      facilitatorAccessToken,
      sdkCorrelationID,
      partnerAttributionID,
      hcfSessionID
    }
  } else {
    throw new Error(SUBMIT_ERRORS.MISSING_BOTH_FUNCTIONS);
  }
}

/* eslint-enable flowtype/require-exact-type */
