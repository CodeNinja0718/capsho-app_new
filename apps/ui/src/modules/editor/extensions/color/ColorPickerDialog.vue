<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { menuIcons } from 'src/modules/editor/menu/menu-icons'

const props = defineProps({
  editor: {
    type: Object,
    required: true
  }
})

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

const hexColor = ref('#6666ff')

const disable = computed(() => {
  return !(hexColor.value.length > 0)
})
function onOKClick () {
  if (!hexColor.value) return

  try {
    props.editor
      .chain()
      .focus()
      .setColor(hexColor.value)
      .run()
  } finally {
    onDialogOK()
  }
}
</script>

<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide">
    <q-card class="color-picker-card q-pa-md poppins-regular text-darkish text-16">
      <q-card-section class="q-py-sm">
        <p class="text-h6">Pick color</p>
      </q-card-section>
      <q-card-section class="q-py-xs">
        <q-badge
          class="q-mb-sm"
          color="grey-3"
          text-color="black">
          {{ hexColor }}
        </q-badge>

        <q-chip
          :color="hexColor"
          :icon="menuIcons.color"
          :label="hexColor"
          :style="{ background: hexColor }"
          text-color="darkish"
          :title="hexColor"
        />

        <q-color
          v-model="hexColor"
          class="color-picker"
          default-view="palette"
          no-footer
          no-header
        />
      </q-card-section>
      <q-card-actions
        align="right"
        class="q-px-md"
      >
        <app-button
          class="dialog-button"
          :disable="disable"
          label="Apply"
          no-caps
          @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped lang="scss">
.color-picker-card {
  width: 100%;
  max-width: 300px;
  border-radius: 10px;
}

.color-picker {
  max-width: 250px;
}
</style>
