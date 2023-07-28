export type CaptionType = 'promotion' | 'engagement' | 'educational'

export interface ICaptionOption {
  default: boolean;
  disable: boolean;
  isBeta?: boolean;
  isPro?: boolean;
  label: 'Promotion' | 'Engagement' | 'Educational';
  tooltip: string;
  value: CaptionType;
}

export interface ICaptionData {
  educational: string;
  educationalRaw: {
    [key: string]: string;
  };
  engagement: string;
  engagementRaw: {
    [key: string]: string;
  };
  promotion: string;
  promotionRaw: {
    [key: string]: string;
  };
}

export interface IStoreCaptions {
  facebook: ICaptionData;
  linkedin: ICaptionData;
  twitter: ICaptionData;
  tiktok: ICaptionData;
}
