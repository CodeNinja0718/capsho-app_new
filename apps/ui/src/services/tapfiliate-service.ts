import axios from 'axios'
const backend = 'http://localhost:3000/'

export const createAffiliate = async (param: {
  email: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  company?: {
    name?: string;
  };
  address?: {
    address?: string;
    postal_code?: string;
    city?: string;
    state?: string;
    country?: {
      code?: string;
    };
  };
}) => {
  try {
    const res: { body: { id: string } } = await axios.post(`${backend}create-affiliate`, param)
    return res.body.id
  } catch (err) {
    console.log(err)
    return ''
  }
}

export const addAffiliateToProgram = async (param: {
  affiliate: {
    id: string;
  };
  approved?: boolean;
  coupon?: string;
}) => {
  try {
    const res: { body: { referral_link: { link: string } } } = await axios.post(`${backend}create-affiliate`, param)
    return res.body.referral_link.link
  } catch (err) {
    return ''
  }
}
