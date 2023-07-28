<script>
import { useFolderStore } from 'src/stores/folder-store'
import { biCameraReelsFill } from '@quasar/extras/bootstrap-icons'
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
import DeleteDialog from 'src/components/DeleteDialog.vue'
import FolderImage from '../components/FolderImage.vue'
import FolderUpdate from 'src/modules/podcast/components/FolderUpdate.vue'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

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
  <div class="container px-4 md:px-8 lg:px-12 xl:px-16 mx-auto poppins-regular text-grey-3 py-8">
    <div class="my-shows flex items-center justify-between">
      <div class="shows-icon">
        <q-icon
          class="icon"
          color="accent"
          :name="biCameraReelsFill"
        />
        <span class="shows-content lexend-regular">My Shows</span>
      </div>
      <div class="shows-search">
        <q-icon
          name="search"
          size="md"></q-icon>
        <input
          class="search-input"
          type="text">
      </div>
    </div>
    <draggable
      v-model="folders"
      class="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 xl:grid-cols-12 justify-center sm:justify-start gap-8"
      item-key="id"
      @end="sortDocuments"
    >
      <template #header>
        <div class="col-span-3 text-center q-mt-xl">
          <div @click="createDialog = true">
            <div class="text-center bg-dialog-dark border-1 create-folder h-[240px] flex flex-col justify-center items-center">
              <q-img
                class="inline-block w-16"
                src="~src/assets/icons/plus.svg"
              />
              <p class="create-content lexend-regular">
                Create <br>new folder
              </p>
            </div>
          </div>
        </div>
      </template>
      <template #item="{ element }">
        <div
          v-if="element.id"
          class="col-span-3 text-center q-mt-xl"
        >
          <div
            v-if="element.id === 'default'"
            class="w-full h-[240px] flex flex-col justify-center items-center"
          >
            <q-img
              alt=""
              class="shadow-4 cursor-pointer w-full h-[240px]"
              loading="lazy"
              :src="element.folderFileUrl"
              @click="gotoEpisodes(element.id)"
            >
              <div
                v-if="element.placeHolderImg"
                class="absolute-bottom text-caption"
              >
                Placeholder image
              </div>
              <span>{{ element.podcastName }}</span>
            </q-img>
          </div>
          <div v-else>
            <FolderImage
              :element="element"
              @editFolder="editFolder(element)"
              @gotoEpisodes="gotoEpisodes(element.id)"
              @handleDelete="handleDelete(element.id)"
            />
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
.my-shows{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Lexend';
  .shows-icon{
    .icon{
      display: inline-block;
      font-size: 40px;
      margin-top: 0;
    }
    .shows-content{
      font-family: 'Lexend';
      display: inline;
      font-size: 26px;
      font-weight: 600;
      padding-left: 14px;
      vertical-align: top;
    }
  }
  .shows-search{
    font-size: 15px;
    .search-input{
      margin-left: 10px;
      border-radius: 30px;
      width: 300px;
      font-family: 'Lexend';
      outline: none;
      padding: 4px 10px;
      color: white;
      background-color: $secondary-dark;
      border: 3px solid transparent;
      transition: 0.2s;
      &:focus{
        border: 3px solid $accent;
      }
    }
  }
}
.create-folder{
  border-radius: 15px;
  background-color: $secondary-dark;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
  box-shadow: 0 0 10px transparent;
  transition: 0.3s;
  cursor: pointer;
  &:hover{
    box-shadow: 0 0 10px grey;
  }
  .create-content{
    padding-top: 0px;
    font-size: 18px;
    font-family: 'Lexend';
  }
}

span {
  display: block;
  font-family: 'Lexend';
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
