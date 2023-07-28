<template>
  <div class="row justify-center">
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="10px"
      skip-hijack
    />
    <div class="col-8">
      <q-form
        class="row full-width justify-center items-center q-gutter-md"
        enctype="multipart/form-data"
        @submit.prevent="onSubmit"
        @reset="onReset"
      >
        <input
          type="file"
          @change="handleSelectedFile"
        >
        <div>
          <q-btn
            label="Submit"
            type="submit"
            color="primary"
          />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </div>
    <div>
      <a
        :href="downloadURL"
        target="_blank"
      >{{ downloadURL }}</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { uploadPodcast } from '@/services/storageService'

const downloadURL = ref('')
const bar = ref(null)
const file = ref(null)

function handleSelectedFile (e) {
  file.value = takeFile(e)
  console.log(file.value)
}

function takeFile(e) {
  return e.target.files[0]
}

async function onSubmit () {
  const barRef = bar.value
  barRef.start()
  try {
    downloadURL.value = await uploadPodcast(file.value)
  } catch (e) {
    console.error(e.message)
  } finally {
    barRef.stop()
  }
}
function onReset () {
  file.value = null
}
</script>

<style scoped>

</style>
