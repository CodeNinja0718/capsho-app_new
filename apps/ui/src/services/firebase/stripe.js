import { addDoc, collection, getDocs, onSnapshot, query, where, doc } from 'firebase/firestore'
import { firestore } from 'src/services/firebase/db'
import { useAuthStore } from 'stores/auth-store'
import { getAuth, getIdTokenResult } from 'firebase/auth'
import { logtail } from 'boot/logtail'
import { slackFrontendErrors } from 'boot/axios'
import { CONSTANTS } from 'src/config'

/**
 * @return {Promise<null|Readonly<{isSubscribed: boolean, role: string, interval: string}>>}
 */
export async function isUserSubscribed () {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const decodedToken = getIdTokenResult(user, true)
  const claims = (await decodedToken)?.claims
  const stripeRole = claims.stripeRole
  return Object.freeze({
    role: String(stripeRole),
    isSubscribed: (!!stripeRole) && stripeRole !== 'trial',
    interval: String(claims.interval ?? 'month')
  })
}

export async function getStripeProducts () {
  try {
    const authStore = useAuthStore()
    const monthly = []
    const yearly = []
    // const oneTime = []
    const filterProductIds = ['prod_M5rhTs1m42ay5B', 'prod_M5rpHRFongbbvF', 'prod_M5rsQUMavAyRYi']
    const collectionRef = collection(firestore(), 'stripe_products')
    const productsQuery = query(collectionRef, where('active', '==', true))
    return getDocs(productsQuery)
      .then((products) => {
        const productsQuerySnap = products.docs.filter((doc) => filterProductIds.includes(doc.id))
        productsQuerySnap.forEach(async (doc) => {
          const priceRef = collection(firestore(), 'stripe_products', doc.id, 'prices')
          const priceQuery = query(priceRef, where('active', '==', true))
          const priceQuerySnap = await getDocs(priceQuery)
          priceQuerySnap.docs.forEach((priceDoc) => {
            const price = {
              id: priceDoc.id,
              ...priceDoc.data(),
              displayPrice: formatAmount(priceDoc.data().unit_amount, priceDoc.data().currency),
              perYear: doc.data().role === 'essentials' ? formatAmount(36000, 'usd')
                : doc.data().role === 'growth' ? formatAmount(49700, 'usd')
                  : 0,
              perEpisode: doc.data().role === 'essentials' ? formatAmount(1500, 'usd')
                : doc.data().role === 'growth' ? formatAmount(1500, 'usd')
                  : formatAmount(1200, 'usd'),
              desc: doc.data().role === 'essentials' ? ['Full access for 4 credits each month <strong>+ $15 for each additional credit</strong><br> Unused credits roll over each month']
                : doc.data().role === 'growth' ? ['Full access for 4 credits each month <strong>+ $15 for each additional credit</strong><br> Unused credits roll over each month', 'Monthly Training with a Podcast Growth Expert', 'Access to the private Capsho Mastermind', 'Access to the Annual Grow My Podcast Summit VIP All Access Pass', 'Monthly Podcast Review & Feedback Swaps']
                  : ['Full access to Capsho for 16 credits per month <strong>+ $12 for each additional credit</strong><br> Unused credits roll over each month']
            }
            if (price.interval === 'month') {
              monthly.push({
                id: doc.id,
                label: doc.data().name,
                value: doc.data().name,
                ...doc.data(),
                subscription: doc.data().role !== 'casual',
                price: {
                  ...price
                }
              })
            } else if (price.interval === 'year') {
              yearly.push({
                id: doc.id,
                label: doc.data().name,
                value: doc.data().name,
                ...doc.data(),
                subscription: doc.data().role !== 'casual',
                price: {
                  ...price
                }
              })
            }
          })
        })
      })
      .then(() => {
        authStore.stripeProducts = monthly
        authStore.yearlyProducts = yearly
        return monthly
      })
  } catch (err) {
    if (err instanceof Error) {
      logtail?.error('stripe.js - getStripeProducts', {
        message: err.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: getStripeProducts',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: err.message
              }
            }
          ]
        }
      }))
    }
  }
}

export async function chargeOneTimePayment (priceId, redirectURL) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const colRef = collection(firestore(), 'users', user.uid, 'checkout_sessions')
  const docRef = await addDoc(colRef, {
    mode: 'payment',
    price: priceId,
    line_items: [
      {
        price: priceId,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10
        },
        quantity: 1
      }
    ],
    quantity: 1,
    success_url: redirectURL,
    cancel_url: redirectURL
  })
  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(docRef, (snap) => {
    const { error, url } = snap.data()
    if (error) {
      // Show an error to your customer and
      // inspect your Cloud Function logs in the Firebase console.
      alert(`An error occurred: ${error.message}`)
      logtail?.error('stripe.js - chargeOneTimePayment', {
        message: error.message
      })
    }
    if (url) {
      // We have a Stripe Checkout URL, let's redirect.
      window.location.assign(url)
    }
  })
}

export async function startSubscriptionSession (priceId, redirectURL) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const colRef = collection(firestore(), 'users', user.uid, 'checkout_sessions')
  const docRef = await addDoc(colRef, {
    price: priceId,
    success_url: redirectURL,
    cancel_url: redirectURL
  })
  // Wait for the CheckoutSession to get attached by the extension
  onSnapshot(docRef, (snap) => {
    const { error, url } = snap.data()
    if (error) {
      // Show an error to your customer and
      // inspect your Cloud Function logs in the Firebase console.
      alert(`An error occurred: ${error.message}`)
      logtail?.error('stripe.js - startSubscriptionSession', {
        message: error.message
      })
      Promise.resolve(slackFrontendErrors({
        method: 'POST',
        headers: {
          'Content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: ':ghost: startSubscriptionSession',
                emoji: true
              }
            },
            {
              type: 'divider'
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: error.message
              }
            }
          ]
        }
      }))
    }
    if (url) {
      // We have a Stripe Checkout URL, let's redirect.
      window.location.assign(url)
    }
  })
}

export async function startProSubscriptionSessionWithOffer (priceId) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const colRef = collection(firestore(), 'users', user.uid, 'checkout_sessions')
  const redirectURL = window.location.origin + '/podcast/upload'
  const couponId = CONSTANTS.APP.PRO_PLAN_COUPON_ID
  const docRef = await addDoc(colRef, {
    mode: 'subscription',
    price: priceId,
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    quantity: 1,
    discounts: [{
      coupon: couponId
    }],
    success_url: redirectURL,
    cancel_url: redirectURL
  })
  onSnapshot(docRef, (snap) => {
    const { error, url } = snap.data()
    if (error) {
      alert(`An error occurred: ${error.message}`)
      logtail?.error('stripe.js - startProSubscriptionSessionWithOffer', {
        message: error.message
      })
    }
    if (url) {
      window.location.assign(url)
    }
  })
}

export async function getSubscriptionOneTime() {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const uid = user.uid
  const db = firestore()
  const subsRef = collection(db, 'users', uid, 'subscriptions')
  const subsQuery = query(
    subsRef,
    where('status', 'in', ['trialing', 'active', 'unpaid', 'past_due'])
  )
  const sub = await getDocs(subsQuery)
  return sub.docs.length > 0 ? sub.docs[0].data() : null
}
/**
 * @return {Promise<null | DocumentData>}
 */
export async function getSubscription () {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const authStore = useAuthStore()
  if (typeof authStore.unsubSubscriptionListener === 'function') {
    authStore.unsubSubscriptionListener()
  }
  const uid = user.uid
  const db = firestore()
  const subsRef = collection(db, 'users', uid, 'subscriptions')
  const subsQuery = query(
    subsRef,
    where('status', 'in', ['trialing', 'active', 'unpaid', 'past_due'])
  )
  let activeSub
  const sub = await getDocs(subsQuery)
  if (sub.docs.length) {
    const docRef = doc(db, `users/${uid}/subscriptions/${sub.docs[0].id}`)
    authStore.unsubSubscriptionListener = onSnapshot(docRef, (doc) => {
      authStore.currentSubscription = doc.data()
      activeSub = doc.data()
    })
  } else {
    activeSub = null
  }
  return activeSub
}

export async function getSubInvoices (subId) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    return null
  }
  const uid = user.uid
  const invoicesRef = collection(firestore(), 'users', uid, 'subscriptions', subId, 'invoices')
  const invoices = []
  const invoicesSnap = await getDocs(invoicesRef)
  invoicesSnap.docs.forEach((doc) => {
    invoices.push({
      ...doc.data(),
      displayPrice: formatAmount(doc.data().amount_paid, 'usd')
    })
  })
  return invoices
}

export function formatAmountForUSLocale (amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'usd'
  }).format(amount)
}
// Format amount for display in the UI
export function formatAmount (amount, currency) {
  amount = zeroDecimalCurrency(amount, currency)
    ? amount
    : (amount / 100).toFixed(2)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount)
}

// Format amount for Stripe
export function formatAmountForStripe (amount, currency) {
  return zeroDecimalCurrency(amount, currency)
    ? amount
    : Math.round(amount * 100)
}

// Check if we have a zero decimal currency
// https://stripe.com/docs/currencies#zero-decimal
export function zeroDecimalCurrency (amount, currency) {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol'
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency
}
