<script setup lang="ts">
import GridView from 'src/modules/editor/GridView.vue'
import { onMounted } from 'vue'
import { useDocumentStore } from 'src/stores/document-state'

const documentStore = useDocumentStore()
const { getAllTemplates } = documentStore

onMounted(() => {
  getAllTemplates()
})

</script>

<template>
  <div class="flex justify-center pt-[10em]">
    <GridView></GridView>
  </div>
</template>
