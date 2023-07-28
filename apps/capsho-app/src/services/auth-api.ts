import { cloudFunction } from 'src/services/firebase/base'
import { HttpsCallableResult } from 'firebase/functions'

/** ********** Auth Api ***************/
export interface IsDomainBannedResponse extends HttpsCallableResult {
  result: boolean;
}
/**
 * @param {string} email
 * @return {Promise<unknown>}
 */
export async function lookUpDomain (
  {
    email
  }: {
    email: string;
  }
): Promise<{ result: boolean } | unknown> {
  const response = await cloudFunction('signUpApi-accountLookUp')({
    email
  })
  return response.data
}
