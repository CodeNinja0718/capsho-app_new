<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDocumentStore } from 'src/stores/document-state'
import ToolBox from './ToolBox.vue'
import TextWidget from './TextWidget.vue'
import ImageWidget from './ImageWidget.vue'
import QuoteWidget from './QuoteWidget.vue'
import DateWidget from './DateWidget.vue'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

// store to refs
const documentStore = useDocumentStore()
const { getResources } = storeToRefs(documentStore)

</script>

<template>
  <div class="grid grid-cols-5 gap-4 mx-[20px]">
    <div>
      <tool-box></tool-box>
    </div>
    <div class="col-span-4 relative">
      <div class="parent">
        <div
          v-for="(item, index) in getResources"
          :key="index">

          <text-widget
            v-if="item.type == 'text'"
            :index="index"
            :item="item"
          ></text-widget>

          <image-widget
            v-if="item.type == 'image'"
            :index="index"
            :item="item"
          ></image-widget>

          <date-widget
            v-if="item.type == 'date'"
            :index="index"
            :item="item"
          ></date-widget>

          <quote-widget
            v-if="item.type == 'quote'"
            :index="index"
            :item="item"
          ></quote-widget>
        </div>
      </div>
    </div>
  </div>
</template>
