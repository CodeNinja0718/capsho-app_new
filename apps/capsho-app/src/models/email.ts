export type EmailType = 'promotion' | 'engagement'

export interface IEmailOption {
  default: boolean;
  disable: boolean;
  isBeta?: boolean;
  label: 'Promotion' | 'Engagement';
  tooltip: string;
  value: EmailType;
}

export interface IEmailData {
  engagement: {
    [key: string]: string;
  };
  promotion: {
    [key: string]: string;
  };
}

export interface IStoreEmails {
  engagement: {
    [key: string]: string;
  };
  engagementBody: string;
  promotion: {
    [key: string]: string;
  };
  promotionBody: string;
}
