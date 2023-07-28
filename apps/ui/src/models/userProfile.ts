export interface UserDoc {
  betaUserGotFreeCredits?: boolean;
  businessLogoURL: string;
  businessName: string;
  createdAt: number;
  defaultFolder: boolean;
  email: string;
  facebookLink: string;
  firstName: string;
  hasSeenCapshoBetaOffer: boolean;
  hasSeenOnboardingTutorial: boolean,
  id: string;
  instagramLink: string;
  isCacheRefreshed: boolean;
  isDoneOnBoarding?: boolean;
  isDoneOnBoardingFlow: boolean;
  isLoggedIn?: boolean;
  lastName: string;
  linkedinLink: string;
  liveMode?: boolean;
  phone: string;
  podcastLink: string;
  podcastName: string;
  proPlanOfferCountdown?: number;
  readonly fullName?: string;
  setup_secret?: string;
  showAgencyPlan?: boolean;
  stripeId?: string;
  twitterLink: string;
  websiteLink: string;
  youtubeLink: string;
  role?: {
    additionalCredits: number,
    additionalEpisodePrice?: string
    beta: boolean
    cancelAtPeriodEnd?: boolean
    limitCount: number,
    monthlyCredits: number,
    monthlyCreditsSet?: object,
    plan?: string
    status?: string
    trialCredits?: number
  }
}

export class UserData {
  betaUserGotFreeCredits: boolean
  businessLogoURL: string
  businessName: string
  createdAt: number
  defaultFolder: boolean
  email: string
  facebookLink: string
  firstName: string
  hasSeenCapshoBetaOffer: boolean
  hasSeenOnboardingTutorial: boolean
  id: string
  instagramLink: string
  isCacheRefreshed: boolean
  isDoneOnBoardingFlow: boolean
  isLoggedIn?: boolean
  lastName: string
  linkedinLink: string
  liveMode?: boolean
  phone: string
  podcastLink: string
  podcastName: string
  proPlanOfferCountdown?: number
  setup_secret?: string
  showAgencyPlan?: boolean
  stripeId?: string
  twitterLink: string
  websiteLink: string
  youtubeLink: string
  role?: {
    additionalCredits: number,
    additionalEpisodePrice?: string
    beta: boolean
    limitCount: number,
    monthlyCredits: number,
    plan?: string
    trialCredits?: number
  }

  constructor (docData: UserDoc) {
    this.betaUserGotFreeCredits = docData.betaUserGotFreeCredits ?? false
    this.businessLogoURL = docData.businessLogoURL
    this.businessName = docData.businessName
    this.createdAt = docData.createdAt
    this.defaultFolder = docData.defaultFolder
    this.email = docData.email
    this.facebookLink = docData.facebookLink
    this.firstName = docData.firstName
    this.hasSeenCapshoBetaOffer = docData.hasSeenCapshoBetaOffer
    this.hasSeenOnboardingTutorial = docData.hasSeenOnboardingTutorial
    this.id = docData.id
    this.instagramLink = docData.instagramLink
    this.isCacheRefreshed = docData.isCacheRefreshed
    this.isDoneOnBoardingFlow = docData.isDoneOnBoarding ? docData.isDoneOnBoarding : docData.isDoneOnBoardingFlow
    this.isLoggedIn = docData.isLoggedIn
    this.lastName = docData.lastName
    this.linkedinLink = docData.linkedinLink
    this.liveMode = docData.liveMode ?? false
    this.phone = docData.phone
    this.podcastLink = docData.podcastLink
    this.podcastName = docData.podcastName
    this.proPlanOfferCountdown = docData.proPlanOfferCountdown ?? 0
    this.role = docData.role
    this.setup_secret = docData.setup_secret
    this.showAgencyPlan = docData.showAgencyPlan
    this.stripeId = docData.stripeId
    this.twitterLink = docData.twitterLink
    this.websiteLink = docData.websiteLink
    this.youtubeLink = docData.youtubeLink
  }

  get fullName () {
    return this.firstName + ' ' + this.lastName
  }
}

export interface UserDetails {
  businessName: string
  email: string
  facebookLink: string
  fullName: string
  instagramLink: string
  linkedinLink: string
  podcastLink: string
  podcastName: string
  twitterLink: string
  websiteLink: string
  youtubeLink: string
}

export class UserProfile implements UserDetails {
  businessName: string
  email: string
  facebookLink: string
  fullName: string
  instagramLink: string
  linkedinLink: string
  podcastLink: string
  podcastName: string
  twitterLink: string
  websiteLink: string
  youtubeLink: string

  constructor ({
    businessName,
    email,
    facebookLink,
    fullName,
    instagramLink,
    linkedinLink,
    podcastLink,
    podcastName,
    twitterLink,
    websiteLink,
    youtubeLink
  }: UserDetails) {
    this.businessName = businessName
    this.email = email
    this.facebookLink = facebookLink
    this.fullName = fullName
    this.instagramLink = instagramLink
    this.linkedinLink = linkedinLink
    this.podcastLink = podcastLink
    this.podcastName = podcastName
    this.twitterLink = twitterLink
    this.websiteLink = websiteLink
    this.youtubeLink = youtubeLink
  }
}
