<script setup lang="ts">
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import { ref, computed } from 'vue'
import showImage from 'src/modules/editor/extensions/image/show-image.dialog'
import { useUploadPodcastStore } from 'stores/upload-podcast'
import { evaTrash2 } from '@quasar/extras/eva-icons'
import { biPlus } from '@quasar/extras/bootstrap-icons'

const uploadPodcastStore = useUploadPodcastStore()

const props = defineProps({
  ...nodeViewProps,
  label: {
    type: String,
    required: false,
    default: 'Free text'
  }
})

const editor = ref<Editor>(props.editor)
const openDialog = ref<boolean>(false)
const hovering = ref(false)

const contentList = computed(() => {
  return uploadPodcastStore.contentList
})

const deleteNode = () => {
  editor.value.commands.deleteNode('draggableBlock')
  openDialog.value = false
}

const currentNode = ref(props.node)

const isEmpty = computed(() => {
  return currentNode.value.firstChild
    ? currentNode.value.firstChild.content.size < 1
    : true
})

const createNodeAfter = (label: string) => {
  const pos = props.getPos() + props.node.nodeSize

  const lowerLabel = label && label.toLowerCase()
  const content = lowerLabel.includes('title')
    ? [
      {
        type: 'heading',
        attrs: { level: 2 }
      }
    ]
    : [
      {
        type: 'paragraph'
      }
    ]

  editor
    .value
    .chain()
    .focus()
    .insertContentAt(pos, {
      type: 'draggableBlock',
      attrs: {
        label
      },
      content
    })
    .run()
}
const createImageNode = () => {
  showImage(editor.value as Editor)
}
function setHovering (tf: boolean) {
  hovering.value = tf
}
</script>

<template>
  <node-view-wrapper
    as="div"
    class="draggable-block row items-start q-gutter-x-sm full-width relative-position"
    @mouseout="setHovering(false)"
    @mouseover="setHovering(true)"
  >
    <div
      aria-label="left-menu"
      class="col-auto row q-gutter-x-sm"
      :class="{ 'invisible': !hovering }"
      contentEditable="false"
    >
      <div
        class="draggable-block__button draggable-block__grab-cursor flex flex-center"
        contentEditable=false
        data-drag-handle
        draggable="true"
      >
        <q-icon
          class="draggable-block__icon"
          name="drag_indicator"
          size="16px" />
      </div>
      <div
        class="draggable-block__button cursor-pointer flex flex-center"
        contentEditable=false
      >
        <q-icon
          class="draggable-block__icon"
          color="grey-3"
          name="add"
          size="12px" />
        <q-menu
          v-if="!uploadPodcastStore.changingTab"
          :auto-close="true"
          class="capsho-editor-menu"
          transition-hide="jump-up"
          transition-show="jump-down"
        >
          <q-list
            dense
            style="min-width: 100px"
          >
            <q-item
              v-for="(item, idx) in contentList"
              :key="idx"
              v-close-popup
              clickable
              @click="createNodeAfter(item.label)"
            >
              <q-item-section>{{ item.label }}</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="createImageNode()"
            >
              <q-item-section>Image</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="createNodeAfter('Free text')"
            >
              <q-item-section>Free text</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
    <node-view-content class="col-10 inline-block q-py-sm" />
    <div
      aria-label="delete-btn"
      class="col-auto row q-gutter-x-sm"
      :class="{ 'invisible': !hovering }"
      contentEditable="false"
    >
      <div
        class="draggable-block__button cursor-pointer flex flex-center"
        contentEditable=false
        @click="openDialog = true"
      >
        <q-icon
          class="draggable-block__icon"
          :name="evaTrash2"
          size="20px"
          style="color: red;"
        >
        </q-icon>
      </div>
    </div>
    <span
      :class="isEmpty ? 'label' : 'hidden'"
      contenteditable="false">{{ node.attrs.label }}</span>
  </node-view-wrapper>
  <q-dialog v-model="openDialog">
    <div>
      <div class="w-[350px] lg:w-[470px] xl:w-[576px] h-[220px] bg-dark flex flex-col justify-center items-center gap-8 rounded-3xl border-accent border-2 border-solid relative">
        <q-icon
          class="absolute right-5 top-5 cursor-pointer"
          color="white"
          :name="biPlus"
          size="36px"
          style="rotate: 45deg"
          @click="openDialog = false"
        />
        <div class="text-2xl font-bold text-white">Are you sure you want to delete this block?</div>
        <div class="w-full flex justify-center items-center gap-4 md:gap-10 lg:gap-16 xl:gap-20">
          <q-btn
            color="accent"
            label="Delete"
            no-caps
            rounded
            size="md"
            @click="deleteNode" />
          <q-btn
            color="darkish"
            label="Cancel"
            no-caps
            rounded
            size="md"
            @click="openDialog = false"
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss">
.capsho-editor-menu {
  background-color: $grey-10;
  color: #FFFFFF;
  border-radius: 0.8rem;
  border: 1px solid $grey-8;
}
.label {
  margin-left: 1rem;
  background-color: $grey-9;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: -19px;
  left: 70px;
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem 0.5rem 0 0;
}

.content-empty {
  background: $app-header;
  border: 2px solid #0D0D0D;
  border-radius: 0.8rem;
  padding: 2rem;
}
</style>
