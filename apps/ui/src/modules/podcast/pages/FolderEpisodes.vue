<script setup lang="ts">
import DeleteDialog from 'src/components/DeleteDialog.vue'
import DialogTopicChooser from 'src/modules/podcast/components/DialogTopicChooser.vue'
import DownloadFIle from 'src/modules/podcast/components/DownloadHostAssets.vue'
import MoveToFolder from '../components/MoveToFolder.vue'
import { EpisodeInterfaceDoc } from 'src/models/episode'
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useFolderStore } from 'src/stores/folder-store'
import { useNotification } from 'src/composables/useNotification'
import { useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { useUploadPodcastStore } from 'stores/upload-podcast'

type CreatedTimestamp = {
  [key: string]: { seconds: number }
}

const $q = useQuasar()

const $route = useRoute()
const folderStore = useFolderStore()
const uploadPodcastStore = useUploadPodcastStore()
const { triggerWarning } = useNotification()

const folderId = ref<string>($route.params.id as string)
const showDownloadDialog = ref<boolean>(false)
const showDeleteDialog = ref<boolean>(false)
const showMoveDialog = ref<boolean>(false)
const selectedEpisode = ref<string>('')
const searchTitle = ref<string>('')

folderStore.selectedFolderId = folderId.value as string

const folder = computed(() => folderStore.documents.find((folder) => folder.id === folderId.value))
const podcastName = computed(() => folder.value?.podcastName)
const episodes = computed(() => uploadPodcastStore.episodes.filter((item) => {
  if (folderId.value === 'default') {
    return item.folder === folderId.value || item.folder === 'default'
  } else {
    return item.folder === folderId.value
  }
}))
const columns = computed(() => [
  {
    name: 'title',
    align: 'left',
    label: 'Episode Title', // folder.value?.podcastName ?? 'Episode Title',
    field: 'title',
    sortable: true
  },
  {
    name: 'displayDate',
    label: 'Date Modified',
    field: 'displayDate',
    sortable: true,
    align: 'left',
    sort: (a: string, b: string, rowA: CreatedTimestamp, rowB: CreatedTimestamp) => rowA.createdAt.seconds - rowB.createdAt.seconds
  },
  { name: 'actions', label: '', field: 'actions', align: 'center' }
])

function handleDelete(id: string) {
  selectedEpisode.value = id
  showDeleteDialog.value = true
}
function handleMove(id: string) {
  selectedEpisode.value = id
  showMoveDialog.value = true
}
function fetchUserData() {
  uploadPodcastStore.fetchPodcastEpisodes()
  uploadPodcastStore.resetProcessStep()
}
function assignFolder() {
  if (folder.value) {
    uploadPodcastStore.selectedFolder = folder.value
    uploadPodcastStore.podcastName = folder.value.podcastName
  }
}
function viewEpisode(row: EpisodeInterfaceDoc) {
  const isTopicPicked = row.userPickedTopic
  const isEpisodeProcessing = row.processing
  uploadPodcastStore.topic1List = row.drafts.topics
  uploadPodcastStore.podcastId = row.id
  const transcriptId = row.transcriptRef ? row.transcriptRef.split('/')[1] : null
  if (!transcriptId) {
    throw new Error('Transcript id is missing!')
  }
  uploadPodcastStore.transcriptId = transcriptId
  const onOkClick = (topic: string) => {
    uploadPodcastStore.processStep = 'submitFiles'
    uploadPodcastStore.topic1 = topic
    uploadPodcastStore.updatePodcastEpisode({
      drafts: {
        topic1: topic
      },
      userPickedTopic: true
    })
      .then(() => {
        uploadPodcastStore.createEpisodeDrafts()
      })
  }
  if (!isTopicPicked) {
    $q.dialog({
      component: DialogTopicChooser,
      persistent: false,
      position: 'standard'
    }).onOk((topic) => onOkClick(topic))
  } else if (isEpisodeProcessing) {
    triggerWarning('Your episode is still processing!', true, 'Please allow 10 minutes.')
  } else {
    assignFolder()
    uploadPodcastStore.showEpisodeDialog(row)
  }
}
function deleteEpisode() {
  const id = selectedEpisode.value
  if (id) {
    uploadPodcastStore.deleteEpisode(id)
  }
  selectedEpisode.value = ''
}
function moveEpisode(folderId: string) {
  const id = selectedEpisode.value
  uploadPodcastStore.podcastId = id
  if (id) {
    uploadPodcastStore.updatePodcastEpisode({ folder: folderId })
  }
  selectedEpisode.value = ''
}
function downloadAssets(data: EpisodeInterfaceDoc) {
  uploadPodcastStore.selectedEpisode = data
  showDownloadDialog.value = true
}

watchEffect(async () => {
  const episode = uploadPodcastStore.selectedEpisode
  if (Object.keys(episode).length) {
    let transcriptRef
    if (episode.transcriptRef && typeof episode.transcriptRef === 'string') {
      transcriptRef = episode.transcriptRef.split('/')
      await uploadPodcastStore.$fbServices.getTranscription(transcriptRef[1])
    }
  }
})
watchEffect(async () => {
  const episode = uploadPodcastStore.selectedEpisode
  if (Object.keys(episode).length) {
    let transcriptRef
    if (episode.transcriptRef) {
      transcriptRef = episode.transcriptRef.split('/')
      await uploadPodcastStore.$fbServices.getTranscription(transcriptRef[1])
    }
  }
})
onMounted(() => fetchUserData())
</script>

<template>
  <div class="container mx-auto poppins-regular py-8">
    <div class="flex flex-col gap-10">
      <div class="flex justify-between items-center lexend-regular">
        <h3 class="text-3xl font-semibold">{{ podcastName }}</h3>
        <div class="text-base">
          <q-icon
            name="search"
            size="md"></q-icon>
          <input
            v-model="searchTitle"
            class="ml-2 rounded-full border-none outline-none bg-dialog-dark py-2 px-3 text-xs text-white"
            type="text"
          />
        </div>
      </div>
      <div>
        <h6 class="text-2xl text-white lexend-regular mb-0">Episodes currently processing</h6>
        <span class="text-hint text-lg lexend-regular mb-6">We’ll send you an email when an action is required from you.</span>
        <div class="flex flex-col gap-4">
          <div class="w-full rounded-full flex">
            <div class="bg-"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <h4 class="text-2xl font-semibold lexend-regular">My episodes</h4>
      <div v-if="episodes.length">
        <q-table
          v-show="episodes.length"
          binary-state-sort
          class="poppins-regular"
          :columns="columns"
          grid
          grid-header
          row-key="id"
          :rows="episodes"
          :rows-per-page-options="[0]"
          virtual-scroll
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <div class="w-full grid grid-cols-12 items-center px-8 py-1 text-lg lexend-regular">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :class="col.name === 'title' || col.name === 'displayDate' ? 'col-span-5' : 'col-span-2'"
                  :props="props"
                >
                  {{ col.label }}
                </q-th>
              </div>
            </q-tr>
          </template>
          <template v-slot:item="props">
            <div class="w-full h-auto xl:h-12 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-10 xl:grid-cols-12 items-center poppins-regular text-15 bg-darkish px-8 py-2 rounded-full mb-2">
              <div
                class="col-span-3 md:col-span-6 lg:col-span-4 xl:col-span-5 cursor-pointer ellipsis lexend-regular"
                @click="viewEpisode(props.row)"
              >
                {{ props.row.title || props.row.id }}
              </div>
              <div class="col-span-3 md:col-span-3 lg:col-span-4 xl:col-span-5 lexend-regular">{{ props.row.displayDate }}</div>
              <div class="col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2">
                <div class="row justify-end gap-6">
                  <q-img
                    class="cursor-pointer"
                    height="22px"
                    src="~assets/icons/edit.svg"
                    width="22px"
                    @click="viewEpisode(props.row)"
                  />
                  <q-img
                    class="cursor-pointer"
                    height="22px"
                    src="~assets/icons/download.svg"
                    width="22px"
                    @click="downloadAssets(props.row)"
                  />
                  <q-img
                    class="cursor-pointer"
                    height="22px"
                    src="~assets/icons/move.svg"
                    width="22px"
                    @click="handleMove(props.row.id)"
                  />
                  <q-img
                    class="cursor-pointer"
                    height="22px"
                    src="~assets/icons/trash.svg"
                    width="22px"
                    @click="handleDelete(props.row.id)"
                  />
                </div>
              </div>
            </div>
          </template>
        </q-table>
      </div>
      <div
        v-else
        class="text-center lexend-light text-subtitle1 text-grey-7">
        Your uploaded podcast episodes will be shown here...
      </div>
    </div>
  </div>

  <q-dialog
    v-model="showDownloadDialog"
    position="top"
    seamless>
    <DownloadFIle />
  </q-dialog>
  <q-dialog v-model="showDeleteDialog">
    <DeleteDialog @confirm-delete="deleteEpisode" />
  </q-dialog>

  <q-dialog v-model="showMoveDialog">
    <MoveToFolder @confirm-move="moveEpisode" />
  </q-dialog>

</template>

<style lang="scss">
.q-table thead tr, .q-table tbody td {
  height: auto;
}
.q-table th {
  font-size: 18px;
}
</style>

<style lang="sass">
@import "src/modules/podcast/css/podcast.sass"
.q-img__content > div
  pointer-events: all
  position: absolute
  padding: 16px
  color: #fff
  background: rgba(0, 0, 0, 0.0)

.q-table th, .q-table td
  padding: 0
  text-align: left

.item
  font-family: 'Montserrat', sans-serif
  font-style: normal
  font-weight: 400
  font-size: 14px
  color: #000000

.q-table th, .q-table td
  padding: 0
  text-align: left
</style>
