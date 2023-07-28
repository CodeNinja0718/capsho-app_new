import { h, defineComponent } from 'vue'
import {
  QBtn,
  QCard,
  QCardActions,
  QCardSection,
  QDialog,
  uid,
  useDialogPluginComponent
} from 'quasar'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import type { UploadableFile } from 'src/models/uploadableFile'

export default defineComponent({
  name: 'DialogResolution',
  props: {
    reason: {
      type: String,
      required: false,
      default: 'General Error'
    }
  },
  emits: [
    ...useDialogPluginComponent.emits
  ],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
    const store = useUploadPodcastStore()

    function onOKClick () {
      store.processStep = 'uploadPodcast'
      store.outputEpisodeTab = 'Title & Description'
      store.podcastFile = {} as UploadableFile
      store.router.push({ name: 'UploadPodcast' })
      onDialogOK()
    }

    return () => [
      h(
        QDialog,
        {
          ref: dialogRef,
          persistent: false,
          onHide: onDialogHide
        },
        () => [
          h(
            QCard,
            {
              class: 'file-processing-error-card q-pa-md lexend-regular text-darkish text-16'
            },
            () => [
              h(
                QCardSection,
                {
                  class: 'q-py-sm text-h6'
                },
                () => [
                  'Oops! Seems like there\'s something funny going on with your episode, but don\'t worry we\'re on it!'
                ]
              ),
              h(
                QCardSection,
                {
                  class: 'q-py-sm'
                },
                () => [
                  h(
                    'span',
                    null,
                    'You\'ll get an email from our Co-Founder Bona Rai at '
                  ),
                  h(
                    'a',
                    {
                      href: `mailto:support@capsho.comsubject=${props.reason}`
                    },
                    'support@capsho.com '
                  ),
                  h(
                    'span',
                    null,
                    'with a resolution within 12 hours.'
                  )
                ]
              ),
              h(
                QCardActions,
                null,
                () => [
                  h(
                    QBtn,
                    {
                      class: 'btn-grey border-radius-6',
                      color: 'accent',
                      label: 'Dismiss',
                      id: uid(),
                      noCaps: true,
                      onClick: onOKClick,
                      textColor: 'white'
                    }
                  )
                ]
              )
            ]
          )
        ]
      )
    ]
  }
})
