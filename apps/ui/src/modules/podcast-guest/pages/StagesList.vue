<script setup lang="ts">
import DeleteDialog from 'src/components/DeleteDialog.vue'
import GuestDownload from 'src/modules/podcast-guest/components/DownloadGuestAssets.vue'
import HostDownload from 'src/modules/podcast/components/DownloadHostAssets.vue'
import type { GuestEpisodeDoc, IPotentQuotables } from 'src/models/episode'
import type { IStoreCaptions } from 'src/models/caption'
import type { IStoreEmails } from 'src/models/email'
import { computed, ref } from 'vue'
import { laDownloadSolid, laPenSolid, laTrashAltSolid } from '@quasar/extras/line-awesome'
import { useAuthStore } from 'stores/auth-store'
import { useUploadPodcastStore } from 'stores/upload-podcast'

const authStore = useAuthStore()
const userType = computed(() => {
  return authStore.userType
})

const store = useUploadPodcastStore()
const episodes = computed(() => {
  return store.episodes
})
const selectedEpisode = ref('')
const showDownloadDialog = ref(false)
const showDeleteDialog = ref(false)

function viewEpisode(row: GuestEpisodeDoc) {
  console.log(row)
  store.selectedEpisode = row
  assignGuestData(row)
  store.router.push({ name: 'PodcastGuestEpisodeDrafts' })
}

function handleDelete(id: string) {
  selectedEpisode.value = id
  showDeleteDialog.value = true
}

function deleteEpisode() {
  const id = selectedEpisode.value
  if (id) {
    store.deleteEpisode(id)
  }
  selectedEpisode.value = ''
}

function downloadAssets(row: GuestEpisodeDoc) {
  store.selectedEpisode = row
  assignGuestData(row)
  showDownloadDialog.value = true
}

function assignGuestData(row: GuestEpisodeDoc) {
  store.emailGuest = row.emailGuest ?? {}
  store.emailBodyPromotion = row.emailGuest.promotionBody || ''
  store.emailBodyEngagement = row.emailGuest.engagementBody || ''
  store.allCaptionsGuest = row.allCaptionsGuest ?? {} as IStoreCaptions
  store.allEmailsGuest = row.allEmailsGuest ?? {} as IStoreEmails
  store.potentQuotables = row.potentQuotables || {} as IPotentQuotables
  store.linkedinTemplate = row.linkedinTemplate || ''
  store.podcastId = row.podcastId || ''
  store.transcriptId = row.transcriptId || ''
  if (row.guestCreativeAssets && Array.isArray(row.guestCreativeAssets) && row.guestCreativeAssets.length) {
    store.guestCreativeAssets = row.guestCreativeAssets || []
  }
}

type CreatedTimestamp = {
  [key: string]: { seconds: number }
}
const columns = [
  {
    name: 'title',
    align: 'left',
    label: 'Episode name',
    field: 'title',
    sortable: true
  },
  {
    name: 'podcast',
    align: 'left',
    label: 'Podcast name',
    field: 'podcast'
  },
  {
    name: 'host',
    align: 'left',
    label: 'Host name',
    field: 'host'
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
                class="episode-header text-grey-3"
                :class="col.name === 'title' ? 'col-4' : 'col-2 q-pl-none'"
                :props="props"
              >
                {{ col.label }}
              </q-th>
            </div>
          </q-tr>
        </template>
        <template v-slot:item="props">
          <div class="q-mb-lg full-width border-1 bg-darkish q-px-sm q-py-md item">
            <div class="row items-center justify-between text-grey poppins-regular text-15">
              <div
                class="col-4 cursor-pointer ellipsis px-6 text-grey-3"
                @click="viewEpisode(props.row)"
              >
                {{ props.row.title }}
              </div>
              <div class="col-2">
                {{ props.row.podcastName }}
              </div>
              <div class="col-2">
                {{ props.row.host?.name }}
              </div>
              <div class="col-2 ellipsis">{{ props.row.displayDate }}</div>
              <div class="col-2">
                <div class="row justify-around">
                  <q-icon
                    class="cursor-pointer"
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
      class="text-center lexend-light text-subtitle1 text-grey-7">
      Your uploaded podcast episodes will be shown here...
    </div>
  </div>
  <q-dialog v-model="showDeleteDialog">
    <DeleteDialog @confirm-delete="deleteEpisode" />
  </q-dialog>
  <q-dialog
    v-model="showDownloadDialog"
    position="top"
    seamless>
    <guest-download v-if="userType === 'guest'"/>
    <host-download v-else />
  </q-dialog>
</template>

<style lang="sass">
@import "src/modules/podcast/css/podcast.sass"
</style>
