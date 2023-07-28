import type { BlogPost } from 'src/models/blogPost'

interface Context {
  isGuest: boolean;
  blogPostData: BlogPost;
  result: string;
  solution: string;
}

export function makeBlogPostTemplate (context: Context) {
  const {
    isGuest,
    result,
    solution,
    blogPostData
  } = context
  const {
    blogIntro,
    blogMeetGuest,
    blogSteps,
    blogDetail1,
    blogDetail2,
    blogDetail3,
    blogStrategyDetail1,
    blogStrategyDetail2,
    blogStrategyDetail3,
    blogConclusion
  } = blogPostData
  const introduction = typeof blogIntro === 'string' ? blogIntro : blogIntro.value ?? ''
  const getStepsArray = () => {
    let stepsArray = ['', '', '']
    if (blogSteps) {
      stepsArray = blogSteps.split(/\n/gm).filter((str) => str !== '')
    }
    return stepsArray
  }
  const blogStepsArray = getStepsArray()
  const getBlogOpening = () => {
    if (isGuest) {
      return `${introduction}<br><br>${blogMeetGuest}<br><br>`
    } else {
      return `${introduction}<br><br>`
    }
  }
  const getBlogSteps = () => {
    if (!blogSteps) {
      return ''
    }
    return blogSteps?.replace(/\n/gm, '<br>')
  }
  const getStrategyDetails = () => {
    let stepsArray = ['', '', '']
    if (Array.isArray(blogStepsArray) && blogStepsArray.length) {
      stepsArray = blogStepsArray
    } else {
      stepsArray = getStepsArray()
      if (Array.isArray(stepsArray) && stepsArray.length) {
        // will always return three values
        while (stepsArray.length < 3) {
          stepsArray.push('')
        }
      }
    }
    return `
      <strong>${stepsArray[0]}</strong><br>${blogStrategyDetail1}<br><br>${blogDetail1}<br><br>
      <strong>${stepsArray[1]}</strong><br>${blogStrategyDetail2}<br><br>${blogDetail2}<br><br>
      <strong>${stepsArray[2]}</strong><br>${blogStrategyDetail3}<br><br>${blogDetail3}<br><br>`
  }
  const opening = getBlogOpening()
  const steps = getBlogSteps()
  const strategyDetails = getStrategyDetails()
  const getBlogPostTemplate = () => {
    return `
        ${opening}
        <b>${blogPostData.blogWhyQuestion}</b><br><br>
        ${blogPostData.blogWhyQuestionAnswer}<br><br>
        Here are the steps you need to follow:<br>
        ${steps}<br><br>
        ${strategyDetails}
        ${blogConclusion}<br><br>
        I’d love to hear how you apply ${solution} to get ${result}.
        Leave me a comment on how it went for you or drop any questions you want me to answer!`
  }
  const blogPostTemplate = getBlogPostTemplate()
  return blogPostTemplate ?? ''
}
