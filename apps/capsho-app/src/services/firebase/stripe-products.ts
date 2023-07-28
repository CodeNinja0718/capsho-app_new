type CapshoRoles ='essentials'
  | 'starter'
  | 'pro'
  | 'growth'
  | 'agency'
  | 'collective';

interface IStripeProduct {
  [key: string]: {
    role: CapshoRoles
    additionalEpisodePriceId: string;
    additionalEpisodePrice: string;
    monthlyPrice: string;
    monthlyPriceId: string;
    yearlyPrice: string;
    yearlyPriceId: string;
    yearlySaving: string;
    monthlyCredits: number;
  };
}

interface IRow {
  role: CapshoRoles;
  price: string;
  priceId: string;
  highlight: boolean;
  action: string;
  save: string;
}

export interface IStripeProductRow {
  yearly: IRow[];
  monthly: IRow[];
}

export const stripeLiveProducts = Object.freeze({
  prod_MRiRPDc7TRgyVV: {
    role: 'starter',
    monthlyPriceId: 'price_1Lip0TIxtUtbG5yKX9yaTXXx',
    yearlyPriceId: 'price_1Lip0TIxtUtbG5yKT8fBv0BT',
    monthlyCredits: 4,
    additionalEpisodePriceId: 'price_1Lip0TIxtUtbG5yKXe3q3eM7',
    additionalEpisodePrice: '$7.5',
    monthlyPrice: '$29',
    yearlyPrice: '$290',
    yearlySaving: '17%'
  },
  prod_MRiTaKSKhFBhdE: {
    role: 'growth',
    additionalEpisodePriceId: 'price_1Lip2SIxtUtbG5yKAeanKRt3',
    monthlyPriceId: 'price_1Lip2TIxtUtbG5yKY0wqEr7d',
    yearlyPriceId: 'price_1Lip2SIxtUtbG5yK1dZYubU7',
    monthlyCredits: 4,
    additionalEpisodePrice: '$15',
    monthlyPrice: '$59',
    yearlyPrice: '$590',
    yearlySaving: '17%'
  },
  prod_MRiZ8IDh3nnZ6e: {
    role: 'pro',
    additionalEpisodePriceId: 'price_1LtzaQIxtUtbG5yKKHOptr6l',
    monthlyPriceId: 'price_1Lip8lIxtUtbG5yKHzSDO1ix',
    yearlyPriceId: 'price_1Lip8lIxtUtbG5yKRDmWXiUR',
    monthlyCredits: 4,
    additionalEpisodePrice: '$18',
    monthlyPrice: '$90',
    yearlyPrice: '$864',
    yearlySaving: '20%'
  },
  prod_M5rsQUMavAyRYi: {
    role: 'agency',
    additionalEpisodePriceId: 'price_1LNg8PIxtUtbG5yKM5rPbOut',
    monthlyPriceId: 'price_1LNg8PIxtUtbG5yKxuBj6bkd',
    yearlyPriceId: 'price_1LNgIkIxtUtbG5yKFIwribXd',
    monthlyCredits: 16,
    additionalEpisodePrice: '$12',
    monthlyPrice: '0',
    yearlyPrice: '0',
    yearlySaving: ''
  }
}) as IStripeProduct

export const stripeTestProducts = Object.freeze({
  prod_MN6kO4pVXheNvv: {
    role: 'starter',
    additionalEpisodePriceId: 'price_1Lf11AIxtUtbG5yK3G72sVT4',
    additionalEpisodePrice: '$15',
    monthlyPrice: '$29',
    monthlyPriceId: 'price_1LeMWuIxtUtbG5yKy9TfSL4R',
    yearlyPrice: '$290',
    yearlyPriceId: 'price_1LeMWuIxtUtbG5yK3PuJoLNi',
    yearlySaving: '17%',
    monthlyCredits: 4
  },
  prod_MN6nzO1Z50OhsN: {
    role: 'growth',
    additionalEpisodePriceId: 'price_1Lf0zfIxtUtbG5yKpOYolPdq',
    additionalEpisodePrice: '$15',
    monthlyPrice: '$59',
    monthlyPriceId: 'price_1LeMZYIxtUtbG5yKeFLhJDZR',
    yearlyPriceId: 'price_1LeMZYIxtUtbG5yK82juG7i3',
    yearlyPrice: '$590',
    yearlySaving: '17%',
    monthlyCredits: 4
  },
  prod_MN6pXuKTxTIOSC: {
    role: 'pro',
    additionalEpisodePriceId: 'price_1Lf0ylIxtUtbG5yKwtgIhm3p',
    additionalEpisodePrice: '$18',
    monthlyPrice: '$90',
    monthlyPriceId: 'price_1LeMbaIxtUtbG5yKh0j2br2M',
    yearlyPriceId: 'price_1LeMbaIxtUtbG5yKwReT4rOR',
    yearlyPrice: '$864',
    yearlySaving: '20%',
    monthlyCredits: 4
  },
  prod_MP6XkrGbqLOVUw: {
    role: 'agency',
    additionalEpisodePriceId: 'price_1LgIKaIxtUtbG5yKJDEmjJZj',
    additionalEpisodePrice: '$12',
    monthlyPrice: '0',
    monthlyPriceId: 'price_1LgIKaIxtUtbG5yK9STZGfPF',
    yearlyPriceId: 'price_1LgIKaIxtUtbG5yK9STZGfPF',
    yearlyPrice: '0',
    yearlySaving: '',
    monthlyCredits: 16
  }
}) as IStripeProduct

export function makeStripeProducts(): IStripeProductRow {
  const normalProducts = normalize()
  return Object.freeze(normalProducts)

  function normalize() {
    const stripeProducts = process.env.DEV ? stripeTestProducts : stripeLiveProducts
    const yearly = Object.values(stripeProducts).map((product) => {
      return {
        role: product.role,
        price: product.yearlyPrice,
        priceId: product.yearlyPriceId,
        highlight: false,
        action: 'Get started now',
        save: product.yearlySaving
      }
    })
    const monthly = Object.values(stripeProducts).map((product) => {
      return {
        role: product.role,
        price: product.monthlyPrice,
        priceId: product.monthlyPriceId,
        highlight: false,
        action: 'Get started now',
        save: ''
      }
    })
    return Object.freeze({ yearly, monthly })
  }
}

export function getStarterMonthlyPriceId() {
  if (process.env.DEV) {
    return 'price_1LeMWuIxtUtbG5yKy9TfSL4R'
  } else {
    return 'price_1Lip0TIxtUtbG5yKX9yaTXXx'
  }
}

export function getProProductPriceIds() {
  let proProduct
  if (process.env.DEV) {
    proProduct = stripeTestProducts.prod_MN6pXuKTxTIOSC
    return Object.freeze({
      monthly: proProduct.monthlyPriceId,
      yearly: proProduct.yearlyPriceId,
      additional: proProduct.additionalEpisodePriceId
    })
  } else {
    proProduct = stripeLiveProducts.prod_MRiZ8IDh3nnZ6e
    return Object.freeze({
      monthly: proProduct.monthlyPriceId,
      yearly: proProduct.yearlyPriceId,
      additional: proProduct.additionalEpisodePriceId
    })
  }
}

export function getAgencyProductPriceIds() {
  let agencyProduct
  if (process.env.DEV) {
    agencyProduct = stripeTestProducts.prod_MP6XkrGbqLOVUw
    return Object.freeze({
      monthly: agencyProduct.monthlyPriceId,
      yearly: agencyProduct.yearlyPriceId,
      additional: agencyProduct.additionalEpisodePriceId
    })
  } else {
    agencyProduct = stripeLiveProducts.prod_M5rsQUMavAyRYi
    return Object.freeze({
      monthly: agencyProduct.monthlyPriceId,
      yearly: agencyProduct.yearlyPriceId,
      additional: agencyProduct.additionalEpisodePriceId
    })
  }
}
