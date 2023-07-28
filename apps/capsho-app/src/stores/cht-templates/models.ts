export interface EmailPrompt {
  [key: string]: Array<(cht: {value: string}) => string>;
}

export interface EmailTemplate {
  [key: string]: EmailPrompt;
}

export interface Prompt {
  [key: string]: Array<() => string>;
}

export interface Template {
  [key: string]: Prompt;
}
interface ChtPrompt {
  key: string;
  value: string;
}

export interface DescriptionContext {
  topic2?: string;
  hook?: string;
  hookStatement?: string;
  findings?: string;
  logLine1?: string;
  tagline1?: string;
  intention?: string;
  latestCht: ChtPrompt;
  chtKeys?: string[];
  chtPrompts?: {
    [key: string]: string;
  };
  getDefault?: boolean;
  title?: string;
  isGuest?: boolean;
  guestName?: string;
  quoteB?: string;
  story?: string;
  gistSummary?: string;
}

export interface EngagementCaption extends DescriptionContext {
  result: string;
  podcastName: string;
  audience: string;
  topic1: string;
}
