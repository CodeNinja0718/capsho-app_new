import type { ChoicesValue } from 'src/models/episode'

export type BlogPostType = 'howto' | 'qa' | 'listicle'

export type BlogBody = {
  detail: string;
  position: number;
  stepTitle: string;
  strategy: string;
}

export type BlogTopics = {
  heading: string;
  choices: string[];
}

export interface BlogPost {
  blogConclusion: ChoicesValue
  blogDetail1?: string;
  blogDetail2?: string;
  blogDetail3?: string;
  blogDetails?: object[];
  blogIntro: ChoicesValue;
  blogMeetGuest: string;
  blogPostBody?: BlogBody[];
  blogPostBodyTemplate?: string;
  blogTopics?: BlogTopics;
  blogPostTemplate?: string;
  blogTopic?: string;
  blogSteps: ChoicesValue;
  blogStepsArray?: string[];
  blogStrategyDetail1: string;
  blogStrategyDetail2: string;
  blogStrategyDetail3: string;
  blogStrategyDetails?: object[];
  blogTitle?: ChoicesValue;
  blogTopicIntro?: ChoicesValue;
  blogWhyQuestion?: string;
  blogWhyQuestionAnswer?: string;
  boxerCht?: string;
  laConclusion?: ChoicesValue;
  laIntro?: ChoicesValue;
  laTitle?: ChoicesValue;
}
