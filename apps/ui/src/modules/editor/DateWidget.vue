<script setup lang="ts">
import { useDocumentStore } from 'src/stores/document-state'
import { storeToRefs } from 'pinia'
import { ref, onMounted, watch } from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable/src/components/vue-draggable-resizable.vue'

const documentStore = useDocumentStore()

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

const date = ref('')
const inputData = ref('')

const data = ref(props.item)

const months = ref(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'])

const { preview } = storeToRefs(documentStore)

const timestamp2InputData = (timestamp: number) => {
  const currentDate = new Date(timestamp)
  return months.value[currentDate.getMonth()] + ' ' + currentDate.getDate() + ', ' + currentDate.getFullYear()
}

const timestamp2Date = (timestamp: number) => {
  const currentDate = new Date(timestamp)
  return (currentDate.getMonth() + 1) + '/' + currentDate.getDate() + '/' + currentDate.getFullYear()
}

const date2InputData = (date: string) => {
  const currentDate = date.split('/')
  return months.value[parseInt(currentDate[0]) - 1] + ' ' + currentDate[1] + ', ' + currentDate[2]
}

const date2Timestamp = (date: string) => {
  const currentDate = date.split('/')
  return (new Date(parseInt(currentDate[2]), parseInt(currentDate[0]) - 1, parseInt(currentDate[1]))).getTime()
}

const initEditor = () => {
  inputData.value = timestamp2InputData(data.value.content.timestamp)
  date.value = timestamp2Date(data.value.content.timestamp)
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

const { removeItem } = documentStore

onMounted(() => initEditor())

watch(date, (newDate) => {
  inputData.value = date2InputData(newDate)
  data.value.content.timestamp = date2Timestamp(newDate)
})

</script>

<template>
  <div class="parent border-none">
    <vue-draggable-resizable
      drag-handle=".drag"
      :draggable="!preview"
      :h="data.h"
      :parent="true"
      :resizable="!preview"
      :w="data.w"
      :x="data.x"
      :y="data.y"
      :z="data.order"
      @drag="onDrag"
      @resize="onResize"
    >
      <q-icon
        v-if="!preview"
        class="drag"
        color="primary"
        name="drag_indicator"
        size="sm"
        tag="div"
      />

      <q-btn
        class="delete setting_btn"
        color="pink-13"
        icon="delete_forever"
        round
        size="sm"
        @click="removeItem({key: index})" />
      <q-input
        v-model="inputData"
        class="pl-[10px] mt-[5px] focus:border-none"
        color="white"
        dense
        readonly>
        <template
          v-if="!preview"
          v-slot:append
        >
          <q-icon
            class="cursor-pointer setting_btn setting round primary shadow-1"
            name="event">
            <q-popup-proxy
              cover
              transition-hide="scale"
              transition-show="scale">
              <q-date
                v-model="date"
                mask="M/D/YYYY">
                <div class="row items-center justify-end">
                  <q-btn
                    v-close-popup
                    color="primary"
                    flat
                    label="Close" />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </vue-draggable-resizable>
  </div>
</template>

<style lang="scss" scoped>
.setting{
  color: white;
  background-color: $primary;
  border-radius: 50%;
  padding: 7px;
  font-size: 16px;
  left: 0px;
  top: -4px;
}
</style>
