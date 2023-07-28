import { RefreshInterface } from 'src/models/refreshModel'

export type BlogBody = {
  detail: string;
  position: number;
  stepTitle: string;
  strategy: string;
}

export interface BlogPost {
  blogConclusion: string;
  blogDetail1?: string;
  blogDetail2?: string;
  blogDetail3?: string;
  blogDetails?: object[];
  blogIntro: string | RefreshInterface;
  blogMeetGuest: string;
  blogPostBody?: BlogBody[];
  blogPostBodyTemplate?: string;
  blogPostSeoQuestions?: string[];
  blogPostTemplate?: string;
  blogSeoQuestion?: string;
  blogSteps: string;
  blogStepsArray?: string[];
  blogStrategyDetail1: string;
  blogStrategyDetail2: string;
  blogStrategyDetail3: string;
  blogStrategyDetails?: object[];
  blogTitle?: string;
  blogWhyQuestion?: string;
  blogWhyQuestionAnswer?: string;
  boxerCht?: string;
  linkedInConclusion?: string;
  linkedInIntro?: string;
  linkedInTemplate?: string;
}
