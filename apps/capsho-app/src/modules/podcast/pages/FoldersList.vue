<script>
import { useFolderStore } from 'src/stores/folder-store'
import draggable from 'vuedraggable'
export default {
  preFetch () {
    const store = useFolderStore()
    store.getAllDocuments()
  },
  components: {
    draggable
  }
}
</script>

<script setup>
import CreateFolder from '../components/FolderCreate.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import DeleteDialog from '../components/DeleteDialog.vue'
import FolderImage from '../components/FolderImage.vue'
import FolderUpdate from 'src/modules/podcast/components/FolderUpdate.vue'

const createDialog = ref(false)
const updateDialog = ref(false)
const store = useFolderStore()
const router = useRouter()

const folders = computed({
  get () {
    return store.documents
  },
  set (val) {
    store.documents = val
  }
})

function handleCreated() {
  createDialog.value = false
}

function handleUpdated() {
  updateDialog.value = false
}

function editFolder(folder) {
  store.populateData(folder)
  store.editFolder = true
  updateDialog.value = true
}

function gotoEpisodes(id) {
  router.push({ name: 'PodcastEpisodes', params: { id } })
}

const selectedDocument = ref('')
const showDeleteDialog = ref(false)

function handleDelete(id) {
  selectedDocument.value = id
  showDeleteDialog.value = true
}
function deleteDocument() {
  const id = selectedDocument.value
  if (id) {
    store.deleteDocument(id)
  }
  selectedDocument.value = ''
}
function sortDocuments() {
  store.sortDocumentToFolder()
}
</script>

<template>
  <div class="outer q-pb-lg poppins-regular text-darkish">
    <draggable
      v-model="folders"
      class="row justify-start"
      item-key="id"
      @end="sortDocuments"
    >
      <template #header>
        <div class="col-3 text-center q-mt-xl">
          <q-img
            alt=""
            class="cursor-pointer"
            height="200px"
            src="~assets/add-folder.png"
            style="cursor:pointer"
            width="200px"
            @click="createDialog = true"
          />
          <span
            class="text-grey-secondary"
            @click="createDialog = true">
            Create new folder
          </span>
        </div>
      </template>
      <template #item="{ element }">
        <div
          v-if="element.id"
          class="col-3 text-center q-mt-xl"
        >
          <div v-if="element.id === 'default'">
            <q-img
              alt=""
              class="shadow-4 cursor-pointer"
              height="200px"
              loading="lazy"
              :src="element.folderFileUrl"
              width="200px"
              @click="gotoEpisodes(element.id)"
            >
              <div
                v-if="element.placeHolderImg"
                class="absolute-bottom text-caption"
              >
                Placeholder image
              </div>
            </q-img>
            <span>{{ element.podcastName }}</span>
          </div>
          <div v-else>
            <FolderImage
              :element="element"
              @editFolder="editFolder(element)"
              @gotoEpisodes="gotoEpisodes(element.id)"
              @handleDelete="handleDelete(element.id)"
            />
            <span>{{ element.podcastName }}</span>
          </div>
        </div>
      </template>
    </draggable>
  </div>
  <q-dialog
    v-model="createDialog"
    :persistent="false"
  >
    <CreateFolder @onCreated="handleCreated" />
  </q-dialog>

  <q-dialog
    v-model="updateDialog"
    :persistent="false"
  >
    <FolderUpdate @onUpdated="handleUpdated" />
  </q-dialog>

  <q-dialog v-model="showDeleteDialog">
    <DeleteDialog
      text="<strong>Are you sure you want to delete this folder?</strong></br>All episodes inside this folder will also be deleted.</br>If you want to keep them, please move them to another folder."
      @confirm-delete="deleteDocument"
    />
  </q-dialog>
</template>

<style lang="scss" scoped>
.outer {
  border-radius: 50px;
  margin: 0 auto;
  width: 100%;
  max-width: 80vw;
}

span {
  display: block;
  font-family: "Poppins",serif;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  align-items: center;
  margin-top: 20px;
  cursor: pointer;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
