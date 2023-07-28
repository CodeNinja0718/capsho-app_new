/* eslint-disable */
import 'pinia'
import type {Unsubscribe} from '@firebase/firestore'
import type {Unsubscribe as AuthObserver} from 'firebase/auth'
import {ConfirmationResult, User} from 'firebase/auth'
import {UploadableImage} from 'src/models/uploadableFile'
import {UserDoc} from 'src/models/userProfile'
import {LocationQueryValue} from 'vue-router'

export interface CountryObject {
  label: string;
  country_code: string;
  phone_code: number;
  flag: string;
}
type AuthTab = 'signin' | 'signup'
type SignUpSteps = 'emailSignUp' | 'verifyEmail'
export type Onboardning = 'userDetails' | 'userPhone' | 'inputPin' | 'businessDetails'
export interface UtmData {
  [key: string] : string | LocationQueryValue | LocationQueryValue[]
}
declare module 'pinia' {
  export interface AuthStateProperties<> {
    $authFunctions: any;
    authPageTab: AuthTab;
    signUpStep: SignUpSteps,
    onBoarding: Onboardning,
    $router: any,
    router: any,
    $fbServices: any,
    $twilio: any,
    $paymentFunctions: any,
    isAuthenticated: boolean,
    isReady: boolean,
    email: string,
    password: string | null,
    confirmPassword: string | null,
    trialCredits: number,
    firstName: string,
    lastName: string,
    phone: string,
    selectedCountry: CountryObject,
    countryCodes: CountryObject[],
    pin: string,
    businessName: string,
    businessLogo: UploadableImage,
    businessLogoURL: string,
    podcastName: string,
    instagramLink: string,
    facebookLink: string,
    youtubeLink: string,
    twitterLink: string,
    linkedinLink: string,
    websiteLink: string,
    podcastLink: string,
    auth: User,
    user: UserDoc,
    unsubUsersListener: Unsubscribe,
    unsubSubscriptionListener: Unsubscribe;
    authStateUnsubscribe: AuthObserver,
    currentSubscription: {
      status: string;
    };
    uid: string,
    showUpdatePasswordDialog: boolean,
    showUploadLogoDialog: boolean,
    showUpdateEmailDialog: boolean
    phoneVerificationDialog: boolean,
    confirmationResult: ConfirmationResult,
    verificationId: string,
    stripeProducts: [],
    yearlyProducts: [],
    subscriptions: object | null,
    userCustomClaims: {
      role: string | object | undefined,
      isSubscribed: boolean,
      interval: string | undefined
    },
    paymentDark: boolean,
    primaryPurpose: string
    utmData: UtmData
  }
}
