export const applePayOptions = {
  storeDisplayName: 'TEConnect Payments Demo',
  applePayVersion: 4,
  total: { label: 'Total', amount: '1.00', type: 'final' },
  lineItems: [{ label: 'Subtotal', amount: '1.00', type: 'final' }],
  currencyCode: 'USD',
  countryCode: 'US',
  supportedNetworks: ['visa', 'masterCard', 'amex', 'discover'],
  merchantCapabilities: ['supports3DS'],
  additionalOptions: { forceButtonDisplay: true },
}

export const googlePayOptions = {
  gatewayId: 'GP21481460',
  merchantName: 'LukeTurp Payments Demo',
  allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'],
  transactionInfo: {
    currencyCode: 'USD',
    countryCode: 'US',
    totalPriceStatus: 'FINAL',
    totalPrice: '1.00',
    totalPriceLabel: 'Total',
  },
  environment: 'TEST',
}

export const paymentRequestOptions = {
  applePay: applePayOptions,
  googlePay: googlePayOptions,
}

export const cardEntryStyles = {
  base: {
    wrapper: { margin: 0, padding: 2, direction: 'column' },
    variants: {
      inputType: 'outlined',
      inputMargin: 'dense',
      autoMinHeight: true,
    },
    backgroundColor: '#424242',
  },
  boxes: {
    labelColor: '#BB86FC',
    textColor: '#BB86FC',
    borderRadius: 10,
    errorColor: '#CF6679',
    inputColor: '#121212',
  },
}
