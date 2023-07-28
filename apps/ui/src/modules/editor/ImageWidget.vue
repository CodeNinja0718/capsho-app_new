<script setup lang="ts">
import { ref } from 'vue'
import { useDocumentStore } from 'src/stores/document-state'
import { storeToRefs } from 'pinia'

import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'

const openDialog = ref(false)

const documentStore = useDocumentStore()

const { preview } = storeToRefs(documentStore)

const { removeItem, addImageGridItem, addTextGridItem } = documentStore

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
})

const data = ref(props.item)

const openSettingDialog = () => {
  openDialog.value = true
}

const onDrag = (left: number, top: number) => {
  data.value.x = left
  data.value.y = top
}

const onResize = (handle: string, left: number, top: number, width: number, height: number) => {
  data.value.x = left
  data.value.y = top
  data.value.w = width
  data.value.h = height
}

</script>

<template>
  <div class="parent border-none">
    <vue-draggable-resizable
      drag-handle=".drag"
      :draggable="!preview"
      :h="data.h"
      :min-height="150"
      :min-width="150"
      :parent="true"
      :resizable="!preview"
      :w="data.w"
      :x="data.x"
      :y="data.y"
      :z="data.order"
      @drag="onDrag"
      @resize="onResize"
    >
      <q-btn
        v-if="!preview"
        class="add"
        color="primary"
        icon="loupe"
        round
        size="sm"
        tag="div"
      >
        <q-menu
          :auto-close="true"
          class="bg-[#222222] text-white border-white border-2 border-solid"
          transition-hide="jump-up"
          transition-show="jump-down"
        >
          <q-list style="min-width: 100px">
            <q-item
              clickable
              @click="addTextGridItem('Title')">
              <q-item-section>Add Title</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addTextGridItem('Intro')">
              <q-item-section>Add Intro</q-item-section>
            </q-item>
            <!-- <q-separator /> -->
            <q-item
              clickable
              @click="addTextGridItem('SubTitle')">
              <q-item-section>Add SubTitle</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addTextGridItem('SubDetail')">
              <q-item-section>Add SubDetail</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addTextGridItem('Conclusion')">
              <q-item-section>Add Conclusion</q-item-section>
            </q-item>
            <q-item
              clickable
              @click="addImageGridItem()">
              <q-item-section>Add Image</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-icon
        v-if="!preview"
        class="drag"
        color="primary"
        name="drag_indicator"
        size="sm"
        tag="div"
      />

      <q-btn
        v-if="item.type === 'image'"
        class="setting setting_btn"
        color="primary"
        icon="settings"
        round
        size="sm"
        @click="openSettingDialog" />
      <q-btn
        class="delete setting_btn"
        color="pink-13"
        icon="delete_forever"
        round
        size="sm"
        @click="removeItem({key: index})" />
      <q-img :src="data.content.image.src">
        <div
          v-if="data.content.caption.text !== ''"
          :class="data.content.caption.position">
          {{ data.content.caption.text }}
        </div>
      </q-img>
    </vue-draggable-resizable>
  </div>
  <q-dialog
    v-model="openDialog"
    persistent>
    <q-card
      class="q-pa-md"
      style="min-width: 500px">
      <q-card-section>
        <div class="text-h6">Input Image URI</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="data.content.image.src"

          placeholder="Please input Image url on here" />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Input Caption</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          v-model="data.content.caption.text"

          placeholder="Please input caption on here" />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Select Caption position</div>
        <div class="q-gutter-sm flex justify-center">
          <q-radio
            v-model="data.content.caption.position"
            label="TL"
            val="absolute-top-left text-h5" />
          <q-radio
            v-model="data.content.caption.position"
            label="TC"
            val="absolute-top text-center text-h5" />
          <q-radio
            v-model="data.content.caption.position"
            label="TR"
            val="absolute-top-right text-h5" />
        </div>

        <div class="q-gutter-sm flex justify-center">
          <q-radio
            v-model="data.content.caption.position"
            label="ML"
            val="absolute-left text-h5" />
          <q-radio
            v-model="data.content.caption.position"
            label="MC"
            val="absolute-full text-h5 flex flex-center" />
          <q-radio
            v-model="data.content.caption.position"
            label="MR"
            val="absolute-right text-h5" />
        </div>

        <div class="q-gutter-sm flex justify-center">
          <q-radio
            v-model="data.content.caption.position"
            label="BL"
            val="absolute-bottom-left text-h5" />
          <q-radio
            v-model="data.content.caption.position"
            label="BC"
            val="absolute-bottom text-center text-h5" />
          <q-radio
            v-model="data.content.caption.position"
            label="BR"
            val="absolute-bottom-right text-h5" />
        </div>
      </q-card-section>

      <q-card-actions
        align="right"
        class="text-primary">
        <q-btn
          v-close-popup
          flat
          label="Cancel" />
        <q-btn
          v-close-popup
          flat
          label="Confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style lang="scss">
.q-img.q-img--menu{
  width: 100%;
  height: 100%;
}
.q-img__content > div{
  background: rgba(0, 0, 0, 0.25);
}
</style>
