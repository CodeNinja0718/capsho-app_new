export interface IBlogCategory {
    title: string;
    description: string;
    icon: string;
}

export interface IPodcastEpisodeDraftsHostBlogPostTemplate {
    id: string;
    title: string; // Capsho's template
    creator: {
      id: string;
      name?: string;
    };
    content: {
      'Blog Title': {
        choices: Array<string>;
        value: string;
      },
      'Blog Intro': {
        choices: Array<string>;
        value: string;
      },
      'Topic Intro': {
        choices: Array<string>;
        value: string;
      },
      'Image': {
        choices: Array<string>;
        value: string;
      },
      'List Summary': {
        choices: Array<string>;
        value: string;
      },
      'List Point Detail': {
        choices: Array<string>;
        value: string;
      },
      'Blog Conclusion': {
        choices: Array<string>;
        value: string;
      },
      'Call to Action': {
        choices: Array<string>;
        value: string;
      },
    };
    createdAt: Date;
}
