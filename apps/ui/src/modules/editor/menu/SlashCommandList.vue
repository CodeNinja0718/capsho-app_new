<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  command: {
    type: Function,
    required: true
  }
})

watch(props.items, () => {
  selectedIndex.value = 0
})

const selectedIndex = ref(0)
function onKeyup({ event }: { event: KeyboardEvent }) {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

function upHandler() {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

function enterHandler() {
  selectItem(selectedIndex.value)
}

function setSelectedIndex(val: number) {
  selectedIndex.value = val
}

function selectItem(index: number) {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}
</script>

<template>
  <div class="slash-menu-items">
    <q-list
      v-if="items.length"
      class="q-gutter-y-xs"
      dense>
      <q-item
        v-for="(item, index) in items"
        :key="index"
        v-ripple
        class="slash-menu-items__item"
        :class="{ 'is-selected': index === selectedIndex }"
        clickable
        @click="selectItem(index)"
        @keyup.enter="selectItem(index)"
        @mouseenter="setSelectedIndex(index)"
      >
        <q-item-section class="col-2">
          <q-icon
            :name="item.icon"
            size="0.9rem" />
        </q-item-section>
        <q-item-section class="col-auto">
          {{ item.title }}
        </q-item-section>
      </q-item>
    </q-list>
    <div
      v-else
      class="item">
      No result
    </div>
  </div>
</template>
