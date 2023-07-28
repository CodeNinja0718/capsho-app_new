import { computed } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'

export function useContentFiller() {
  const store = useUploadPodcastStore()
  const followLinks = computed(() => {
    const links = Object.keys(store.selectedFolder)
      .reduce((acc, key) => {
        if (['facebookLink', 'linkedinLink', 'twitterLink', 'youtubeLink', 'websiteLink', 'podcastLink'].includes(key)) {
          const value = store.selectedFolder[key]
          if (value) {
            acc.push(value)
          }
        }
        return acc
      }, [])
    return {
      value: '',
      choices: links
    }
  })

  const firstTabContent = [
    {
      label: 'Episode title',
      ...store.title,
      choices: makeSnippets(store.title, 'Episode title')
    },
    {
      label: 'Content Honey Trap',
      ...store.chts,
      choices: makeSnippets(store.chts, 'Content Honey Trap')
    },
    {
      label: 'Guest Bio',
      ...store.guestBio,
      choices: makeSnippets(store.guestBio, 'Guest Bio')
    },
    {
      label: 'Value',
      ...store.findings,
      choices: makeSnippets(store.findings, 'Value')
    },
    {
      label: 'Quote',
      ...store.quoteB,
      choices: makeSnippets(store.quoteB, 'Quote')
    },
    {
      label: 'Summary headings',
      value: '',
      choices: makeSnippets(store.summaryHeadings, 'Summary headings')
    },
    {
      label: 'Summary details',
      value: '',
      choices: Array.isArray(store.summaryDetails)
        ? store.summaryDetails.reduce((acc, summary) => {
          for (const item of summary.choices) {
            acc.push(
              `<div data-label="Summary heading" data-type="draggable-block">
                <h4>${summary.heading}</h4>
              </div>
              <div data-label="Summary details" data-type="draggable-block">
                <p>${item}</p>
              </div>`
            )
          }
          return acc
        }, []) : []
    },
    {
      label: 'Key Moments',
      ...store.keyMoments,
      choices: makeSnippets(store.keyMoments, 'Key Moments')
    },
    {
      label: 'Resources',
      value: '',
      choices: [
        store.resources
      ]
    },
    {
      label: 'Call to action',
      value: '',
      choices: [
        store.selectedFolder.comments
      ]
    },
    {
      label: 'Follow links',
      ...followLinks.value
    }
  ]

  function setContentChooser(tab) {
    console.log(tab)
    let list = []
    if (tab === 'Title & Description') {
      list = firstTabContent
    } else if (tab === 'Podcast Website Content') {
      list = [
        {
          label: 'Content Honey Trap',
          ...store.chts,
          choices: makeSnippets(store.chts, 'Content Honey Trap')
        },
        {
          label: 'Quote',
          ...store.quoteB,
          choices: makeSnippets(store.quoteB, 'Quote')
        },
        {
          label: 'Body',
          value: '',
          choices: [
            store.summary.value,
            store.story.value
          ]
        },
        {
          label: 'Guest Bio',
          ...store.guestBio,
          choices: makeSnippets(store.guestBio, 'Guest Bio')
        },
        {
          label: 'Value',
          ...store.findings,
          choices: makeSnippets(store.findings, 'Value')
        },
        {
          label: 'Resources',
          value: '',
          choices: [
            store.resources
          ]
        },
        {
          label: 'Summary headings',
          value: '',
          choices: makeSnippets(store.summaryHeadings, 'Summary headings')
        },
        {
          label: 'Summary details',
          value: '',
          choices: Array.isArray(store.summaryDetails)
            ? store.summaryDetails.reduce((acc, summary) => {
              for (const item of summary.choices) {
                acc.push(
                  `<div data-label="Summary heading" data-type="draggable-block">
                      <h4>${summary.heading}</h4>
                    </div>
                    <div data-label="Summary details" data-type="draggable-block">
                      <p>${item}</p>
                    </div>`
                )
              }
              return acc
            }, []) : []
        },
        {
          label: 'Chapter summary',
          choices: [store.chapterSummary]
        },
        {
          label: 'Key Moments',
          ...store.keyMoments,
          choices: makeSnippets(store.keyMoments, 'Key Moments')
        },
        {
          label: 'Call to action',
          value: '',
          choices: [
            store.selectedFolder.comments
          ]
        },
        {
          label: 'Follow links',
          ...followLinks.value
        }
      ]
    } else if (tab === 'Email') {
      list = [
        {
          label: 'Email subject',
          ...store.emailSubjectLine,
          choices: makeSnippets(store.emailSubjectLine, 'Email subject')
        },
        {
          label: 'Content Honey Trap',
          ...store.chts,
          choices: makeSnippets(store.chts, 'Content Honey Trap')
        },
        {
          label: 'Story ideas',
          ...store.storyIdeas,
          choices: makeSnippets(store.storyIdeas, 'Story ideas')
        },
        {
          label: 'Story completer',
          ...store.storyCompleter,
          choices: makeSnippets(store.storyCompleter, 'Story completer')
        },
        {
          label: 'Quote',
          ...store.quoteB,
          choices: makeSnippets(store.quoteB, 'Quote')
        },
        {
          label: 'Value',
          ...store.findings,
          choices: makeSnippets(store.findings, 'Value')
        },
        {
          label: 'Call to action',
          value: '',
          choices: [
            store.selectedFolder.comments
          ]
        }
      ]
    } else if (tab === 'Blog Post') {
      if (store.blogPostType === 'listicle') {
        list = [
          {
            label: 'Blog Listicle Title',
            ...store.blogPost.blogTitle,
            choices: makeSnippets(store.blogPost.blogTitle, 'Blog Listicle Title')
          },
          {
            label: 'Blog Listicle Introduction',
            ...store.blogPost.blogIntro,
            choices: makeSnippets(store.blogPost.blogIntro, 'Blog Listicle Introduction')
          },
          {
            label: 'Guest Bio',
            ...store.guestBio
          },
          {
            label: 'Blog Listicle List',
            ...store.blogPost.blogSteps,
            choices: makeSnippets(store.blogPost.blogSteps, 'Blog Listicle List')
          },
          {
            label: 'Listicle List Detail',
            ...store.blogPost.blogPostBody,
            choices: Array.isArray(store.blogPost.blogPostBody)
              ? store.blogPost.blogPostBody.reduce((acc, blogBody) => {
                acc.push(
                  `<div data-label="Listicle List SubHeading" data-type="draggable-block">
                        <h4>${blogBody.stepTitle}</h4>
                    </div>
                    <div data-label="Listicle List Detail" data-type="draggable-block">
                        <p>${blogBody.detail}</p>
                    </div>`
                )
                return acc
              }, []) : []
          },
          {
            label: 'Blog Listicle Conclusion',
            ...store.blogPost.blogConclusion,
            choices: makeSnippets(store.blogPost.blogConclusion, 'Blog Listicle Conclusion')
          },
          {
            label: 'Call to action',
            value: '',
            choices: [
              store.selectedFolder.comments
            ]
          },
          {
            label: 'Image',
            ...store.image
          },
          {
            label: 'Follow links',
            ...followLinks.value
          }
        ]
      } else if (store.blogPostType === 'qa') {
        list = [
          {
            label: 'Blog QA Title',
            ...store.blogPost.blogTitle,
            choices: makeSnippets(store.blogPost.blogTitle, 'Blog QA Title')
          },
          {
            label: 'Blog QA Introduction',
            ...store.blogPost.blogIntro,
            choices: makeSnippets(store.blogPost.blogIntro, 'Blog QA Introduction')
          },
          {
            label: 'Guest Bio',
            ...store.guestBio
          },
          {
            label: 'QA Topic Introduction',
            ...store.blogPost.blogTopicIntro,
            choices: makeSnippets(store.blogPost.blogTopicIntro, 'QA Topic Introduction')
          },
          {
            label: 'Q&A Subheading (QA Questions cut up)',
            ...store.qASubheading
          },
          {
            label: 'Q&A Answer',
            ...store.qAAnswer
          },
          {
            label: 'Blog QA Conclusion',
            ...store.blogQAConclusion,
            choices: makeSnippets(store.blogPost.blogConclusion, 'Blog QA Conclusion')
          },
          {
            label: 'Call to action',
            value: '',
            choices: [
              store.selectedFolder.comments
            ]
          },
          {
            label: 'Image',
            ...store.image
          },
          {
            label: 'Follow links',
            ...followLinks.value
          }
        ]
      } else {
        list = [
          {
            label: 'BlogHowToTitle',
            ...store.blogPost.blogTitle,
            choices: makeSnippets(store.blogPost.blogTitle, 'BlogHowToTitle')
          },
          {
            label: 'BlogHowToIntroduction',
            ...store.blogPost.blogIntro,
            choices: makeSnippets(store.blogPost.blogIntro, 'BlogHowToIntroduction')
          },
          {
            label: 'Guest Bio',
            ...store.guestBio
          },
          {
            label: 'BlogHowToTopic Introduction',
            ...store.blogPost.blogTopicIntro,
            choices: makeSnippets(store.blogPost.blogTopicIntro, 'BlogHowToTopic Introduction')
          },
          {
            label: 'BlogHowToSteps',
            ...store.blogPost.blogSteps,
            choices: makeSnippets(store.blogPost.blogSteps, 'BlogHowToSteps')
          },
          {
            label: 'BlogHowToStrategyDetails',
            ...store.blogPost.blogPostBody,
            choices: Array.isArray(store.blogPost.blogPostBody)
              ? store.blogPost.blogPostBody.reduce((acc, blogBody) => {
                acc.push(
                  `<div data-label="BlogHowToStrategyDetails SubHeading" data-type="draggable-block">
                        <h4>${blogBody.stepTitle}</h4>
                    </div>
                    <div data-label="BlogHowToStrategyDetails Detail" data-type="draggable-block">
                        <p>${blogBody.detail}</p>
                    </div>`
                )
                return acc
              }, []) : []
          },
          {
            label: 'BlogHowToAddDetails',
            ...store.blogHowToAddDetails
          },
          {
            label: 'BlogHowToConclusion',
            ...store.blogPost.blogConclusion,
            choices: makeSnippets(store.blogPost.blogConclusion, 'BlogHowToConclusion')
          },
          {
            label: 'Call to action',
            value: '',
            choices: [
              store.selectedFolder.comments
            ]
          },
          {
            label: 'Image',
            ...store.image
          },
          {
            label: 'Follow links',
            ...followLinks.value
          }
        ]
      }
    } else if (tab === 'LinkedIn Article') {
      if (store.blogPostType === 'qa') {
        list = [
          {
            label: 'LinkedIn Article QA Title',
            ...store.laTitle,
            choices: makeSnippets(store.laTitle, 'LinkedIn Article QA Title')
          },
          {
            label: 'LinkedIn Article QA Introduction',
            ...store.laIntro,
            choices: makeSnippets(store.laIntro, 'LinkedIn Article QA Introduction')
          },
          {
            label: 'Guest Bio',
            ...store.guestBio
          },
          {
            label: 'QA Topic Introduction',
            ...store.blogPost.blogTopicIntro,
            choices: makeSnippets(store.blogPost.blogTopicIntro, 'QA Topic Introduction')
          },
          {
            label: 'LINKEDIN QA ANSWER SUMMARY',
            ...store.linkedInQAAnswerSummary
          },
          {
            label: 'LinkedIn Article QA Conclusion',
            ...store.laConclusion,
            choices: makeSnippets(store.laConclusion, 'LinkedIn Article QA Conclusion')
          },
          {
            label: 'Call to action',
            value: '',
            choices: [
              store.selectedFolder.comments
            ]
          },
          {
            label: 'Image',
            ...store.image
          }
        ]
      } else if (store.blogPostType === 'listicle') {
        list = [
          {
            label: 'LinkedIn Article Title',
            ...store.laTitle,
            choices: makeSnippets(store.laTitle, 'LinkedIn Article QA Title')
          },
          {
            label: 'LinkedIn Article Introduction',
            ...store.laIntro,
            choices: makeSnippets(store.laIntro, 'LinkedIn Article Introduction')
          },
          {
            label: 'Guest Bio',
            ...store.guestBio
          },
          {
            label: 'Topic Introduction',
            ...store.blogPost.blogTopicIntro,
            choices: makeSnippets(store.blogPost.blogTopicIntro, 'Topic Introduction')
          },
          {
            label: 'Blog Listicle List',
            ...store.blogPost.blogSteps,
            choices: makeSnippets(store.blogPost.blogSteps, 'Blog Listicle List')
          },
          {
            label: 'LINKEDIN LISTICLE LIST DETAIL SUMMARY',
            ...store.linkedInListicleListDetailSummary
          },
          {
            label: 'LinkedIn Article Listicle Conclusion',
            ...store.laConclusion,
            choices: makeSnippets(store.laConclusion, 'LinkedIn Article Listicle Conclusion')
          },
          {
            label: 'Call to action',
            value: '',
            choices: [
              store.selectedFolder.comments
            ]
          },
          {
            label: 'Image',
            ...store.image
          }
        ]
      } else {
        list = [
          {
            label: 'LinkedIn Article HowToTitle',
            ...store.laTitle,
            choices: makeSnippets(store.laTitle, 'LinkedIn Article HowToTitle')
          },
          {
            label: 'LinkedIn Article HowToIntroduction',
            ...store.laIntro,
            choices: makeSnippets(store.laIntro, 'LinkedIn Article HowToIntroduction')
          },
          {
            label: 'Guest Bio',
            ...store.guestBio
          },
          {
            label: 'BlogHowToTopic Introduction',
            ...store.blogPost.blogTopicIntro,
            choices: makeSnippets(store.blogPost.blogTopicIntro, 'BlogHowToTopic Introduction')
          },
          {
            label: 'BlogHowToSteps',
            ...store.blogPost.blogSteps,
            choices: makeSnippets(store.blogPost.blogSteps, 'BlogHowToSteps')
          },
          {
            label: 'BlogHowToStrategyDetails',
            ...store.blogPost.blogPostBody,
            choices: Array.isArray(store.blogPost.blogPostBody)
              ? store.blogPost.blogPostBody.reduce((acc, blogBody) => {
                acc.push(
                  `<div data-label="BlogHowToStrategyDetails SubHeading" data-type="draggable-block">
                        <h4>${blogBody.stepTitle}</h4>
                    </div>
                    <div data-label="BlogHowToStrategyDetails Detail" data-type="draggable-block">
                        <p>${blogBody.detail}</p>
                    </div>`
                )
                return acc
              }, []) : []
          },
          {
            label: 'LinkedIn Article HowToConclusion',
            ...store.laConclusion,
            choices: makeSnippets(store.laConclusion, 'LinkedIn Article HowToConclusion')
          },
          {
            label: 'Call to action',
            value: '',
            choices: [
              store.selectedFolder.comments
            ]
          },
          {
            label: 'Image',
            ...store.image
          }
        ]
      }
    } else if (tab === 'YouTube Description') {
      list = [
        {
          label: 'YouTube Title',
          ...store.youtubeTitle,
          choices: makeSnippets(store.youtubeTitle, 'YouTube Title')
        },
        {
          label: 'Hook',
          value: '',
          choices: [store.hook]
        },
        {
          label: 'Value',
          ...store.findings,
          choices: makeSnippets(store.findings, 'Value')
        },
        {
          label: 'Resources',
          value: '',
          choices: [store.resources]
        },
        {
          label: 'Follow links',
          ...followLinks.value
        },
        {
          label: 'Key Moments',
          ...store.keyMoments,
          choices: makeSnippets(store.keyMoments, 'Key Moments')
        }
      ]
    }
    store.contentList = list
  }

  function makeSnippets(content, label = 'Free text') {
    const choices = (typeof content === 'object' && content.choices) || null
    if (!choices || !Array.isArray(choices)) {
      return []
    }
    const result = []
    for (const item of choices) {
      const normalItem = (item && typeof item === 'string' && item.replace(/"/g, '').trim()) || ''
      result.push(
        `<div data-label="${label}" data-type="draggable-block">
            <p>${normalItem}</p>
          </div>`
      )
    }
    return result
  }

  return Object.freeze({
    setContentChooser
  })
}
