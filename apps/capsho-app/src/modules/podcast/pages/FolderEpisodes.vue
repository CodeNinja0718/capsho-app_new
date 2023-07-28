<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import DownloadFIle from 'src/components/DownloadFIle.vue'
import DeleteDialog from '../components/DeleteDialog.vue'
import MoveToFolder from '../components/MoveToFolder.vue'
import { useRoute } from 'vue-router'
import { useFolderStore } from 'src/stores/folder-store'
import { laDownloadSolid, laFileExportSolid, laPenSolid, laTrashAltSolid, laUndoSolid } from '@quasar/extras/line-awesome'
import { EpisodeInterfaceDoc } from 'src/models/episode'

const $route = useRoute()
const folderId = ref($route.params.id)
const folderStore = useFolderStore()
folderStore.selectedFolderId = folderId.value as string
const folder = computed(() => folderStore.documents.find((folder) => folder.id === folderId.value))

const episodes = computed(() => store.episodes.filter((item) => {
  if (folderId.value === 'default') {
    return item.folder === folderId.value || item.folder === 'default'
  } else {
    return item.folder === folderId.value
  }
}))

const showDownloadDialog = ref(false)
const showDeleteDialog = ref(false)
const showMoveDialog = ref(false)
const selectedEpisode = ref('')

function handleDelete(id: string) {
  selectedEpisode.value = id
  showDeleteDialog.value = true
}
function handleMove(id: string) {
  selectedEpisode.value = id
  showMoveDialog.value = true
}
const store = useUploadPodcastStore()

watchEffect(async () => {
  const episode = store.selectedEpisode
  if (Object.keys(episode).length) {
    let transcriptRef
    if (episode.transcriptRef && typeof episode.transcriptRef === 'string') {
      transcriptRef = episode.transcriptRef.split('/')
      await store.$fbServices.getTranscription(transcriptRef[1])
    }
  }
})

function fetchUserData() {
  store.fetchPodcastEpisodes()
  store.resetProcessStep()
}

onMounted(() => fetchUserData())

function assignFolder() {
  if (folder.value) {
    store.selectedFolder = folder.value
    store.podcastName = folder.value.podcastName
  }
}

function viewEpisode(row: EpisodeInterfaceDoc) {
  assignFolder()
  store.showEpisodeDialog(row)
}

function deleteEpisode() {
  const id = selectedEpisode.value
  if (id) {
    store.deleteEpisode(id)
  }
  selectedEpisode.value = ''
}

function moveEpisode(folderId: string) {
  const id = selectedEpisode.value
  store.podcastId = id
  if (id) {
    store.updatePodcastEpisode({ folder: folderId })
  }
  selectedEpisode.value = ''
}

function downloadAssets(data: EpisodeInterfaceDoc) {
  store.selectedEpisode = data
  showDownloadDialog.value = true
}

type CreatedTimestamp = {
  [key: string]: { seconds: number }
}
const columns = [
  {
    name: 'title',
    align: 'left',
    label: folder.value?.podcastName ?? 'Episode name',
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
]
</script>

<template>
  <div class="outer poppins-regular">
    <div>
      <q-breadcrumbs
        active-color="accent"
        class="text-13 text-grey-secondary"
        gutter="xs">
        <q-breadcrumbs-el
          :icon="laUndoSolid"
          label="Go Back"
          :to="{ name: 'PodcastFolders' }" />
        <q-breadcrumbs-el :label="folder.podcastName"/>
      </q-breadcrumbs>
    </div>
    <div style="margin-top: 72px;">
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
              <div class="row items-center">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  class="episode-header text-grey-secondary"
                  :class="col.name === 'title' ? 'col-6' : 'col-3 q-pl-none'"
                  :props="props"
                >
                  {{ col.label }}
                </q-th>
              </div>
            </q-tr>
          </template>
          <template v-slot:item="props">
            <div class="q-mb-lg full-width border-1 q-px-sm q-py-md item">
              <div class="row items-center justify-between text-darkish poppins-regular text-15">
                <div
                  class="col-6 cursor-pointer ellipsis px-6"
                  @click="viewEpisode(props.row)"
                >
                  {{ props.row.title }}
                </div>
                <div class="col-3 ellipsis">{{ props.row.displayDate }}</div>
                <div class="col-3">
                  <div class="row justify-around">
                    <q-icon
                      class="cursor-pointer text-readable-secondary"
                      :name="laPenSolid"
                      size="1.3rem"
                      @click="viewEpisode(props.row)"
                    />
                    <q-icon
                      class="cursor-pointer"
                      :name="laDownloadSolid"
                      size="1.3rem"
                      @click="downloadAssets(props.row)"
                    />
                    <q-icon
                      class="cursor-pointer"
                      :name="laFileExportSolid"
                      size="1.3rem"
                      @click="handleMove(props.row.id)"
                    />
                    <q-icon
                      class="cursor-pointer"
                      :name="laTrashAltSolid"
                      size="1.3rem"
                      @click="handleDelete(props.row.id)"
                    />
                    <q-img
                      class="cursor-pointer hidden"
                      height="24px"
                      src="~assets/edit.png"
                      width="20px"
                      @click="store.showEpisodeDialog(props.row)"
                    />
                    <q-img
                      class="cursor-pointer hidden"
                      height="24px"
                      src="~assets/download.png"
                      width="20px"
                      @click="showDownloadDialog = true" />
                    <q-img
                      class="cursor-pointer hidden"
                      height="24px"
                      src="~assets/transfer.png"
                      width="24px"
                      @click="handleMove(props.row.id)"
                    />
                    <q-img
                      class="cursor-pointer hidden"
                      height="24px"
                      src="~assets/delete.png"
                      width="20px"
                      @click="handleDelete(props.row.id)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-table>
      </div>
      <div
        v-else
        class="text-center lexend-deca-light text-subtitle1 text-grey-7">
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

<style lang="sass" scoped>
.border-1
  background: linear-gradient(321.86deg, #FFFFFF 37.07%, #F5F4FF 91.59%)
  border-radius: 6px
  border: 1px solid rgba(0, 0, 0, 0.12)
.outer
  border-radius: 50px
  margin: 0 auto
  width: 100%
  max-width: 80vw

.episode-card
  width: 100%
  max-width: 62vw
  max-height: 69vh
  border: 3px solid #FBDFB3
  border-radius: 50px

.q-img__content > div
  pointer-events: all
  position: absolute
  padding: 16px
  color: #fff
  background: rgba(0, 0, 0, 0.0)

.bg-blur
  backdrop-filter: blur(2rem)

.q-table th, .q-table td
  padding: 0
  text-align: left

.episode-header
  font-family: 'Poppins', sans-serif
  font-style: normal
  font-weight: 300
  font-size: 16px
  //color: #717171

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
