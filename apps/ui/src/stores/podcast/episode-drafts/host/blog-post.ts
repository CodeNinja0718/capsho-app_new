import { defineStore, PodcastEpisodeDraftsHostBlogPostProperties } from 'pinia'
import { IPodcastEpisodeDraftsHostBlogPostTemplate } from 'src/models/podcast/episode-drafts/host/blogPost.interface'

export const usePodcastEpisodeDraftsHostBlogPostStore = defineStore('podcast/episode-drafts/host/blog-post', {
  state: () => ({
    newTemplate: {
      id: '',
      title: 'New Template',
      creator: {
        id: '',
        name: ''
      },
      content: {
        'Blog Title': {
          choices: ['Respiratory Challenges', 'Theo\'s Miraculous Revival', 'Purpose in Life', 'Self-Love and Gratitude', 'Service-Based Influencers'],
          value: ''
        },
        'Blog Intro': {
          choices: [
            'Uncover the power of self-love and gratitude to enrich your life and bring greater joy, success and abundance.',
            'Discover the power of self-love and gratitude and unlock the door to a life of joy and abundance!',
            'Discover how self-love and gratitude can unlock your path to true happiness and success!'
          ],
          value: ''
        },
        'Topic Intro': {
          choices: [
            'You will learn how to harness the power of self-love and gratitude to enrich your life and bring greater joy, success, and abundance',
            'You will learn how to tap into the power of self-love and gratitude to create a life filled with joy, success and abundance.'
          ],
          value: ''
        },
        Image: {
          choices: [],
          value: ''
        },
        'List Summary': {
          choices: [
            'Overcoming Respiratory Difficulties',
            'The Phenomenon of Theo\'s Miraculous Recovery',
            'Discovering Your Purpose in Life',
            'Cultivating Self-Love and Gratitude',
            'Becoming an Impactful Service-Based Influencer'
          ],
          value: ''
        },
        'List Point Detail': {
          choices: [
            'Judson and his wife experienced a severe shock when their son Theo flatlined due to an allergic reaction. In a miraculous moment, the doctors declared him alive again, giving Judson a profound understanding of self-love and gratitude in his life, as he had been desperate to make the pain go away. This newfound understanding set him on a mission to help others believe in the beauty of life and to be truly grateful for the precious spark of life that we have.',
            'Judson and his wife were expecting their second child and were filled with joy as he entered the world. However, when things take a sudden and tragic turn, their joy is quickly replaced by grief as their child died in front of their eyes. In a tragic twist of fate, Judson felt a higher power tell him it was his purpose to reach out and help others and the sparks of life miraculously flowed back into the little baby. Judson learned the important life lesson that life is a precious spark that can disappear in a moment and that we should be grateful for the moments we have together.',
            'Judson and his wife Mindy experienced heartbreak firsthand when their new baby, Theo, flatlined at the hospital. In a moment of desperation, Judson prayed not knowing if his wish to bring Theo back to life would ever be granted. Miraculously, Theo recovered with the help of the medical professionals, teaching Judson a valuable lesson in self-love and gratitude. After such a powerful experience, Judson has been determined to spread his message to help others understand the importance of loving and appreciating what we have in everyday life.'
          ],
          value: ''
        },
        'Blog Conclusion': {
          choices: [
            'Your purpose is to touch people and help them believe in a higher power to believe in their life being a precious, magical, extraordinary thing that we take for granted every day',
            'It\'s better to enjoy the things you have now, rather than wait for something like what we went through to possibly happen',
            'It starts with self-love, self-respect and living a life where you’re proud to be you.'
          ],
          value: ''
        },
        'Call to Action': {
          choices: [
            'Jud Burden\'s journey to greater understanding began when he faced the all too real possibility of losing his newborn son. Now, Jud uses his story to remind others of the fragility of life and to appreciate each moment.',
            'Jud Burden experienced immense pain and then discovered his life mission - to share the indescribable power of self-love, faith and gratitude. Jud knows first-hand, the power of the present moment.'
          ],
          value: ''
        }
      },
      createdAt: new Date()
    } as IPodcastEpisodeDraftsHostBlogPostTemplate,
    templates: [] as Array<IPodcastEpisodeDraftsHostBlogPostTemplate>,
    unsubUsersDataListener: {}
  } as PodcastEpisodeDraftsHostBlogPostProperties),
  actions: {
    async fetchBlogPostTemplates() {
      await this.$fbServices.getPodcastEpisodeDraftsHostTemplates()
    },
    async addBlogPostTemplate(data: IPodcastEpisodeDraftsHostBlogPostTemplate) {
      await this.$fbServices.createPodcastEpisodeDraftsHostTemplates(data)
    }
    // addBlogTitle(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content['Blog Title'].choices.push(title)
    //   } else {
    //     this.newTemplate.content['Blog Title'].choices.push(title)
    //   }
    // },
    // addBlogIntro(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content['Blog Intro'].choices.push(title)
    //   } else {
    //     this.newTemplate.content['Blog Intro'].choices.push(title)
    //   }
    // },
    // addTopicIntro(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content['Topic Intro'].choices.push(title)
    //   } else {
    //     this.newTemplate.content['Topic Intro'].choices.push(title)
    //   }
    // },
    // addImage(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content.Image.choices.push(title)
    //   } else {
    //     this.newTemplate.content.Image.choices.push(title)
    //   }
    // },
    // addListSummary(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content['List Summary'].choices.push(title)
    //   } else {
    //     this.newTemplate.content['List Summary'].choices.push(title)
    //   }
    // },
    // addListPointDetail(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content['List Point Detail'].choices.push(title)
    //   } else {
    //     this.newTemplate.content['List Point Detail'].choices.push(title)
    //   }
    // },
    // addBlogConclusion(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content['Blog Conclusion'].choices.push(title)
    //   } else {
    //     this.newTemplate.content['Blog Conclusion'].choices.push(title)
    //   }
    // },
    // addCallToAction(title: string, templateIndex: number) {
    //   if (templateIndex >= 0) {
    //     this.templates[templateIndex].content['Call to Action'].choices.push(title)
    //   } else {
    //     this.newTemplate.content['Call to Action'].choices.push(title)
    //   }
    // }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: sessionStorage,
        paths: [
          'templates'
        ]
      }
    ]
  }
})
