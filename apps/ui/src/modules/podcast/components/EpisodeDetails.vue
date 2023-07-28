<script setup lang="ts">
import { useNotification } from 'src/composables/useNotification'
import { useFolderStore } from 'src/stores/folder-store'
import { useUploadPodcastStore } from 'src/stores/upload-podcast'
import { ref, computed, onMounted } from 'vue'

const uploadPodcastStore = useUploadPodcastStore()
const folderStore = useFolderStore()

const isGuest = ref<boolean>(true)
const folder = ref(null)
const createDialog = ref<boolean>(false)

const guestName = computed({
  get () {
    return uploadPodcastStore.guestName
  },
  set (val: string) {
    uploadPodcastStore.guestName = val.split(',').join(',')
  }
})

function findFolderById(id: string) {
  const folders = folderStore.documents
  return folders.find((folder) => folder.id === id)
}
function selectFolder({ id }: { id: string }) {
  uploadPodcastStore.folder = id
  const selectedFolder = findFolderById(id)
  if (selectedFolder) {
    uploadPodcastStore.selectedFolder = selectedFolder
    uploadPodcastStore.podcastName = selectedFolder.podcastName
  }
}
function createFolder() {
  createDialog.value = false
  folderStore.$reset()
  folderStore.getAllDocuments()
}
function createDialogFunc() {
  createDialog.value = true
}
async function moveToTheNext() {
  const { triggerNegative } = useNotification()
  try {
    uploadPodcastStore.isGuest = Boolean(isGuest.value)
    uploadPodcastStore.guestName = guestName.value
    uploadPodcastStore.processStep = 'submitFiles'
    uploadPodcastStore.uploadPodcastToStorage()
  } catch (e) {
    if (e instanceof Error) {
      triggerNegative(e.message)
    }
  }
}

onMounted(() => {
  folderStore.getAllDocuments()
})
</script>

<template>
  <div class="flex flex-col items-center md:items-start gap-4">
    <h4 class="text-2xl font-semibold">Episode Details</h4>
    <div class="w-full flex justify-between items-start gap-6">
      <div>
        <h6 class="text-lg mb-0">Did this episode have a guest?</h6>
        <p class="text-base">Select if you're interviewing a special guest (or guests).</p>
      </div>
      <div>
        <q-toggle
          v-model="isGuest"
          checked-icon="check"
          class="text-12"
          color="accent"
          size="md"
          unchecked-icon="clear"
        />
        <q-icon
          class="cursor-pointer"
          color="accent-custom"
          name="help"
          size="24px"
        >
          <AppTooltip
            anchor="top middle"
            class="tooltip-text rounded-borders"
            max-width="20vw"
            self="bottom middle"
          >
            <template #body>
              Click Yes if you're interviewing a special
              guest (or guests).
              <strong>This doesn't include your Co-Host</strong> if
              you have one (as special as they are 😉)
            </template>
          </AppTooltip>
        </q-icon>
      </div>
    </div>
    <div class="w-full flex justify-between items-start gap-6">
      <div>
        <h6 class="text-lg mb-0">Guest(s) full name(s)</h6>
        <p class="text-base">Add all of your guests names with comma between each name (this is important)!</p>
      </div>
      <div class="">
        <q-input
          id="guest-fullname"
          v-model="guestName"
          autocomplete="off"
          color="accent"
          dark
          lazy-rules="ondemand"
          name="guest-fullname"
          no-error-icon
          outlined
          :rules="[
            val => !!val || '*Podcast name is required'
          ]"
          text-color="white"
          type="text"
        />
      </div>
    </div>
    <div class="w-full flex justify-between items-start gap-6">
      <div>
        <h6 class="text-lg mb-0">Save to a folder</h6>
        <p class="text-base">Choose a folder to save your episode.</p>
      </div>
      <q-select
        v-model="folder"
        class="w-64 flex items-center"
        label="Select"
        name="podcastName"
        option-label="podcastName"
        option-value="id"
        :options="folderStore.documents"
        outlined
        @update:modelValue="selectFolder"
      >
        <template #no-option>
          <div
            class="text-bold cursor-pointer"
            @click="createDialogFunc"
          >
            <q-item>
              Create folder
            </q-item>
          </div>
        </template>
        <template #before-options>
          <div
            class="text-bold cursor-pointer"
            @click="createDialogFunc"
          >
            <q-item>
              Create folder
            </q-item>
          </div>
        </template>
        <q-dialog
          v-model="createDialog"
          :persistent="false"
        >
          <CreateFolder @submit="createFolder" />
        </q-dialog>
      </q-select>
    </div>
    <div class="flex items-start gap-6">

    </div>
    <div class="w-full flex justify-end">
      <q-btn
        class="ml-auto"
        color="accent"
        no-caps
        rounded
        text-color="white"
        @click="moveToTheNext"
      >
        Let's go
      </q-btn>
    </div>
  </div>
</template>
