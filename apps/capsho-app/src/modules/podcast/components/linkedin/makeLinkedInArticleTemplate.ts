import type { BlogPost } from 'src/models/blogPost'
import type { RefreshInterface } from 'src/models/refreshModel'
import normalize, { normalizeResult } from 'stores/cht-templates/normalizer'
import upperFirst from 'src/helpers/upper-first-char'

interface Context {
  isGuest: boolean;
  articleIntro: RefreshInterface | string;
  blogPostData: BlogPost;
  result: string;
  title: string;
  podcastName: string;
}

export function makeLinkedInArticleTemplate (context: Context) {
  const {
    isGuest,
    result,
    blogPostData,
    articleIntro,
    title,
    podcastName
  } = context
  const {
    blogMeetGuest,
    blogSteps,
    blogStepsArray,
    blogPostBody,
    linkedInConclusion,
    linkedInIntro
  } = blogPostData
  const introduction = articleIntro ?? linkedInIntro
  const getStepsArray = () => {
    let stepsArray
    if (blogStepsArray && Array.isArray(blogStepsArray) && blogStepsArray.length > 1) {
      stepsArray = normalize(blogStepsArray.join(' '))
    } else {
      stepsArray = normalize(blogSteps)
    }
    return stepsArray
  }
  const getBlogOpening = () => {
    if (isGuest) {
      return `<span class="article-intro">${introduction}<br><br>${blogMeetGuest}<br><br></span>`
    } else {
      return `<span class="article-intro">${introduction}<br><br></span>`
    }
  }
  const normalSteps = getStepsArray()
  const getArticleBody = () => {
    let template = ''
    if (blogPostBody) {
      for (const val of blogPostBody) {
        const upperTitle = upperFirst(val.stepTitle)
        template += `
        <b>${upperTitle}</b><br/>
        ${val.strategy}<br/><br/>
      `
      }
    }
    return template
  }
  const articleBody = getArticleBody()
  const normalResult = normalizeResult(result)
  const getLinkedInArticleTemplate = () => {
    return `${getBlogOpening()}
      Here are the steps you need to follow to also get ${normalResult}:
      ${normalSteps}<br><br>
      ${articleBody}
      ${linkedInConclusion}<br><br>
      For more on this topic and perspective,
      check out this episode ${title} on my podcast ${podcastName}.`
  }
  const blogPostTemplate = getLinkedInArticleTemplate()
  return blogPostTemplate ?? ''
}
