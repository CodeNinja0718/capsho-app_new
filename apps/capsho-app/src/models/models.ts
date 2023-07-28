export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Words {
  words: [
    {
      text: string;
      replacements: string[];
    }
  ]
}

export interface Alternative {
  reduce(arg0: (str: string, obj: { text: string; label: string; words: Array<{text: string, label: string}>}) => string, arg1: string): string;
  [key: number]: Words;
}

export interface Transcript {
  alternative?: Alternative;
  chapterSummaries: string;
  chapters?: Array<object>;
  confidence?: number;
  docId: string;
  duration?: number;
  editedTranscript: string;
  gistSummaries?: string;
  headlineSummaries?: string;
  id: string;
  labeledText: string;
  language_code?: string;
  language_model?: string;
  paragraphs?: object[];
  paragraphsText?: string;
  punctuate?: boolean;
  speakerLabeledText: string;
  speakerLabels: string[];
  speakers?: string[];
  text: string;
  uid: string;
  url?: string;
  webhook_url?: string;
  words: Array<object>;
}
