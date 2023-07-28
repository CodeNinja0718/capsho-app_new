import type { ICaptionOption } from 'src/models/caption'
import { useSubscription } from 'src/composables/useSubscription'

export function useCaptionOption() {
  const { allowBlogPost } = useSubscription()
  const options: ICaptionOption[] = [
    {
      default: true,
      disable: false,
      label: 'Promotion',
      tooltip: 'A selection of quotes that will motivate your audience',
      value: 'promotion'
    },
    {
      default: false,
      disable: false,
      label: 'Engagement',
      tooltip: 'A selection of quotes from the story you or your podcast-guest shared in the episode',
      value: 'engagement'
    },
    {
      default: false,
      disable: !allowBlogPost.value,
      isPro: true,
      label: 'Educational',
      tooltip: 'A selection of quotes from the story you or your podcast-guest shared in the episode',
      value: 'educational'
    }
  ]
  return {
    options
  }
}
