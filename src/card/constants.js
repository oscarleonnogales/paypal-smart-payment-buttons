/* @flow */

import cardValidator from 'card-validator';
import { CARD } from '@paypal/sdk-constants/src';

import { FRAME_NAME } from '../constants';

import type { FieldStyle, CardType, CardPlaceholder } from './types';

const { types } = cardValidator.creditCardType;

export const CARD_FIELD_TYPE = {
    SINGLE: 'single',
    NUMBER: 'number',
    CVV:    'cvv',
    EXPIRY: 'expiry',
    NAME:   'name',
    POSTAL: 'postal'
};

export const GQL_ERRORS = {
    '/payment_source/card/number': {
        'VALIDATION_ERROR':           ('INVALID_NUMBER' : 'INVALID_NUMBER'),
        'MISSING_REQUIRED_PARAMETER': ('MISSING_NUMBER' : 'MISSING_NUMBER')
    },
    '/payment_source/card/expiry': {
        'INVALID_PARAMETER_SYNTAX':   ('INVALID_EXPIRATION_DATE_FORMAT' : 'INVALID_EXPIRATION_DATE_FORMAT'),
        'INVALID_STRING_LENGTH':      ('INVALID_EXPIRATION_DATE_LENGTH' : 'INVALID_EXPIRATION_DATE_LENGTH'),
        'CARD_EXPIRED':               ('CARD_EXPIRED' : 'CARD_EXPIRED'),
        'MISSING_REQUIRED_PARAMETER': ('MISSING_EXPIRATION_DATE' : 'MISSING_EXPIRATION_DATE')
    },
    '/payment_source/card/security_code': {
        'VALIDATION_ERROR':           ('INVALID_SECURITY_CODE' : 'INVALID_SECURITY_CODE')
    },
    'TRANSACTION_REFUSED': ('TRANSACTION_REJECTED' : 'TRANSACTION_REJECTED')
};

export const CARD_ERRORS = {
    INELIGIBLE_CARD_VENDOR: ('INELIGIBLE_CARD_VENDOR': 'INELIGIBLE_CARD_VENDOR'),
    INVALID_NUMBER:         ('INVALID_NUMBER' : 'INVALID_NUMBER'),
    INVALID_EXPIRY:         ('INVALID_EXPIRY' : 'INVALID_EXPIRY'),
    INVALID_CVV:            ('INVALID_CVV' : 'INVALID_CVV'),
    INVALID_NAME:           ('INVALID_NAME' : 'INVALID_NAME'),
    INVALID_POSTAL:         ('INVALID_POSTAL' : 'INVALID_POSTAL')
};

export const SUBMIT_ERRORS = {
    UNABLE_TO_SUBMIT:           ('Card fields not available to submit' : 'Card fields not available to submit'),
    ORDER_ID_TYPE_ERROR:        ('Expected createOrder to return a promise that resolves with the order ID as a string' : 'Expected createOrder to return a promise that resolves with the order ID as a string'),
    VAULT_TOKEN_TYPE_ERROR:     ('Expected createVaultSetupToken to return a promise that resolves with vaultSetupToken as a string' : 'Expected createVaultSetupToken to return a promise that resolves with vaultSetupToken as a string'),
    PASSING_BOTH_FUNCTIONS:     ('Cannot pass both createVaultSetupToken and createOrder' : 'Cannot pass both createVaultSetupToken and createOrder'),
    MISSING_BOTH_FUNCTIONS:     ('Must pass either createVaultSetupToken or createOrder' : 'Must pass either createVaultSetupToken or createOrder'),
    MISSING_ONAPPROVE:          ('onApprove is required when saving card fields' : 'onApprove is required when saving card fields'),
    MISSING_CREATE_VAULT_SETUP: ('createVaultSetupToken is required when saving card fields' : 'createVaultSetupToken is required when saving card fields')
}

export const CARD_FIELD_TYPE_TO_FRAME_NAME : {| [$Values<typeof CARD_FIELD_TYPE>] : $Values<typeof FRAME_NAME> |} = {
    [ CARD_FIELD_TYPE.SINGLE ]: FRAME_NAME.CARD_FIELD,
    [ CARD_FIELD_TYPE.NUMBER ]: FRAME_NAME.CARD_NUMBER_FIELD,
    [ CARD_FIELD_TYPE.CVV ]:    FRAME_NAME.CARD_CVV_FIELD,
    [ CARD_FIELD_TYPE.EXPIRY ]: FRAME_NAME.CARD_EXPIRY_FIELD,
    [ CARD_FIELD_TYPE.NAME ]:   FRAME_NAME.CARD_NAME_FIELD,
    [ CARD_FIELD_TYPE.POSTAL ]: FRAME_NAME.CARD_POSTAL_FIELD
};

export const OPTIONAL_CARD_FIELDS: $ReadOnlyArray<string> = ['name'];

export const FIELD_STYLE : FieldStyle = {
    appearance:              'appearance',
    color:                   'color',
    direction:               'direction',
    font:                    'font',
    fontFamily:              'font-family',
    fontSizeAdjust:          'font-size-adjust',
    fontSize:                'font-size',
    fontStretch:             'font-stretch',
    fontStyle:               'font-style',
    fontVariantAlternates:   'font-variant-alternates',
    fontVariantCaps:         'font-variant-caps',
    fontVariantEastAsian:    'font-variant-east-asian',
    fontVariantLigatures:    'font-variant-ligatures',
    fontVariantNumeric:      'font-variant-numeric',
    fontVariant:             'font-variant',
    fontWeight:              'font-weight',
    letterSpacing:           'letter-spacing',
    lineHeight:              'line-height',
    opacity:                 'opacity',
    outline:                 'outline',
    padding:                 'padding',
    paddingTop:              'padding-top',
    paddingRight:            'padding-right',
    paddingBottom:           'padding-bottom',
    paddingLeft:             'padding-left',
    textShadow:              'text-shadow',
    transition:              'transition',
    MozApperance:            '-moz-appearance',
    MozOsxFontSmoothing:     '-moz-osx-font-smoothing',
    MozTapHighlightColor:    '-moz-tap-highlight-color',
    MozTransition:           '-moz-transition',
    WebkitAppearance:        '-webkit-appearance',
    WebkitOsxFontSmoothing:  '-webkit-osx-font-smoothing',
    WebkitTapHighlightColor: '-webkit-tap-highlight-color',
    WebkitTransition:        '-webkit-transition'
};

// from https://github.com/braintree/inject-stylesheet/blob/main/src/lib/filter-style-values.ts
export const FILTER_CSS_VALUES : $ReadOnlyArray<RegExp> = [
    // prevent injecting additional rules
    /;/,
    // prevent injecting script tags
    /[<>]/,
    // prevent hexadecimal characters
    // (could allow an exploiter to get around the url/expression/javascript rules)
    /\\/,
    /@import/i,
    /expression/i,
    /javascript/i,
    /url/i
];

// from https://github.com/braintree/inject-stylesheet/blob/main/src/lib/validate-selector.ts
export const FILTER_CSS_SELECTORS : $ReadOnlyArray<RegExp> = [
    /^\s*$/,
    /supports/i,
    /import/i,
    /[{}]/,
    /</
];

// $FlowFixMe
export const VALIDATOR_TO_TYPE_MAP = {
    [types.AMERICAN_EXPRESS]: CARD.AMEX,
    [types.DISCOVER]:         CARD.DISCOVER,
    [types.ELO]:              CARD.ELO,
    [types.HIPER]:            CARD.HIPER,
    [types.JCB]:              CARD.JCB,
    [types.MASTERCARD]:       CARD.MASTERCARD,
    [types.UNIONPAY]:         CARD.CUP,
    [types.VISA]:             CARD.VISA
};

export const DEFAULT_CARD_TYPE : CardType = {
    gaps:     [ 4, 8, 12 ],
    lengths:  [ 16 ],
    patterns: [],
    type:     'unknown',
    niceType: 'Unknown',
    code:     {
        name: 'CVV',
        size: 3
    }
};

export const DEFAULT_STYLE = {

    'html, body': {
        'background':  'transparent',
        'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif'
    },
    'body': {
        'margin':  '0',
        'padding': '0.375rem'
    },

    'input': {
        'border':        '0.0625rem solid #909697',
        'border-radius': '0.25rem',
        'box-sizing':    'border-box',
        'background':    '#ffffff',
        'font-family':   'inherit',
        'font-size':     '1.125rem',
        'line-height':   '1.5rem',
        'padding':       '1.25rem 0.75rem',
        'width':         '100%'
    },
    '::placeholder': {
        'color':   '#687173',
        'opacity': '1'
    },
    '.card-icons': {
        'display': 'none'
    },
    '.card-icon': {
        'width':          '40px',
        'height':         '24px',
        'pointer-events': 'none',
        'position':       'absolute',
        'top':            '1.6875rem', // calc(0.375rem + 0.0625rem + 1.25rem)
        'left':           '1.1875rem' // calc(0.375rem + 0.0625rem + 0.75rem)
    },
    'input.card-field-number.display-icon': {
        'padding-left': 'calc(1.2rem + 40px)' // calc(0.75rem + 40px + 0.375rem)' 
    },
    'input.card-field-number.display-icon + .card-icon': {
        'display': 'block'
    },
    'input.card-field-number + .card-icon': {
        'display': 'none'
    }
};

export const DEFAULT_STYLE_MULTI_CARD = {

    ':focus': {
        'border-color': '#000000',
        'box-shadow':   '0 0 0 0.125rem #000000 inset, 0 0 0 0.375rem rgb(0 0 0 / 16%)',
        'outline':      'none'
    },
    ':focus.invalid': {
        'border-color': '#d9360b',
        'box-shadow':   '0 0 0 0.125rem #d9360b inset, 0 0 0 0.375rem rgb(217 54 11 / 16%)'
    },
    '.invalid': {
        'border-color': '#d9360b',
        'box-shadow':   '0 0 0 0.0625rem #d9360b inset',
        'color':        '#d9360b'
    }

};

export const DEFAULT_STYLE_SINGLE_CARD = {

    '.card-field': {
        'background':     '#ffffff',
        'border':         '0.0625rem solid #909697',
        'border-radius':  '0.25rem',
        'box-sizing':     'border-box',
        'display':        'flex',
        'flex-direction': 'row',
        'margin':         '0',
        'padding':        '0'
    },
    '.focus': {
        'border-color': '#000000',
        'box-shadow':   '0 0 0 0.125rem #000000 inset, 0 0 0 0.375rem rgb(0 0 0 / 16%)'
    },
    '.focus.invalid': {
        'border-color': '#d9360b',
        'box-shadow':   '0 0 0 0.125rem #d9360b inset, 0 0 0 0.375rem rgb(217 54 11 / 16%)'
    },
    '.invalid': {
        'border-color': '#d9360b',
        'box-shadow':   '0 0 0 0.0625rem #d9360b inset',
        'color':        '#d9360b'
    },

    'input': {
        'background':    'transparent',
        'border':        'none',
        'border-radius': 'unset',
        'box-sizing':    'content-box',
        'margin':        '0'
    },
    'input, input:focus': {
        'border':     'none',
        'box-shadow': 'none',
        'outline':    'none'
    },
    'input.invalid': {
        'border':     'none',
        'box-shadow': 'none'
    },
    'input.card-field-number': {
        'flex':          '1',
        'min-width':     '4ch',
        'padding-right': '0.375rem'
    },
    'input.card-field-expiry': {
        'padding-left':  '0.375rem',
        'padding-right': '0.375rem',
        'text-align':    'center',
        'width':         '7ch'
    },
    'input.card-field-cvv': {
        'padding-left': '0.375rem',
        'text-align':   'center',
        'width':        '4ch'
    },
    '.card-field-validation-error': {
        'align-items': 'center',
        'color':       '#515354',
        'display':     'flex',
        'font-size':   '0.875rem',
        'margin-top':  '0.375rem'
    },
    '.card-field-validation-error > svg': {
        'color':        '#d9360b',
        'width':        '24px',
        'height':       '24px',
        'margin-right': '0.25rem'
    },
    '.card-field-validation-error.hidden': {
        'visibility': 'hidden'
    }

};

export const DEFAULT_PLACEHOLDERS : CardPlaceholder = {
    number: 'Card number',
    expiry: 'MM / YY',
    cvv:    'CVV',
    name:   'Cardholder Name (optional)',
    postal: 'Postal code'
};

export const VALID_EXTRA_FIELDS = [
    'billingAddress'
];

export const ALLOWED_ATTRIBUTES = [
    "aria-invalid",
    "aria-required",
    "disabled",
    "placeholder",
];

export const DEFAULT_EXPIRY_PATTERN = "{{99}} / {{9999}}";

export const ZERO_PADDED_EXPIRY_PATTERN = "0{{9}} / {{9999}}";

export const FPTI_HCF_KEYS = {
  HCF_SESSION_ID: ("hcf_session_id": "hcf_session_id"),
  HCF_CORRELATION_ID: ("hcf_correlation_id": "hcf_correlation_id"),
  SDK_CORRELATION_ID: ("sdk_correlation_id": "sdk_correlation_id"),
  VAULT_TOKEN: ("vault_token": "vault_token"),
  HCF_ORDER_ID: ('order_id' : 'order_id'),
}
