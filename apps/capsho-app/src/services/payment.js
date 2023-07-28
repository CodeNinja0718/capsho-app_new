import { cloudFunction } from 'src/services/firebase/base'

export async function createSubscription (priceId) {
  return await cloudFunction('payments-createStripeSubscription')({ priceId })
}

export async function cancelSubscription (subId) {
  return await cloudFunction('cancelSubscriptionV2')({ subId })
}

export async function updateSubscription (customerId, priceId, subId) {
  return await cloudFunction('updateSubscriptionV2')({
    customerId,
    priceId,
    subId
  })
}

export async function getOrCreateCustomer (email, uid) {
  return await cloudFunction('getOrCreateStripeCustomerV2')({ email, uid })
}

export async function createPortalSession ({
  customerId,
  redirectUrl
}) {
  return await cloudFunction('createPortalSessionV2')({
    customerId,
    redirectUrl
  })
}

export async function createCheckoutSessionV2 ({
  priceId,
  couponId,
  redirectUrl,
  customerId
}) {
  return await cloudFunction('createCheckoutSessionV2')({
    priceId,
    couponId,
    redirectUrl,
    customerId
  })
}

export async function createTestCustomer (email, uid) {
  return await cloudFunction('createCustomerV2')({ email, uid })
}

export async function getOrCreateTestCustomer (email, uid) {
  return await cloudFunction('testPayments-getOrCreateStripeCustomer')({ email, uid })
}

export async function getSubscriptions (uid) {
  return await cloudFunction('payments-getStripeSubscriptions')({ uid })
}

export async function retrieveSubscription (subId) {
  return await cloudFunction('payments-retrieveSubscription')({ subId })
}

export async function openCustomerPortal () {
  return await cloudFunction('ext-firestore-stripe-payments-createPortalLink')({
    returnUrl: window.location.origin + '/profile/'
  })
}
