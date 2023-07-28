<script setup lang="ts">
import { useDocumentStore } from 'src/stores/document-state'
import { storeToRefs } from 'pinia'

const documentStore = useDocumentStore()

const { preview, templates } = storeToRefs(documentStore)

const { getTemplate, addTemplate } = documentStore

</script>
<template>
  <div class="grid gap-y-[10px]">
    <h5>My Templates</h5>
    <q-btn
      v-for="(template, index) in templates"
      :key="index"
      class="block w-full"
      @click="getTemplate(template.id)">Template</q-btn>

    <h5>Toolbox</h5>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addTextGridItem('Title')"> Add Title </q-btn>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addTextGridItem('Intro')"> Add Intro </q-btn>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addTextGridItem('SubTitle')"> Add Subtitle </q-btn>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addTextGridItem('SubDetail')"> Add SubDetail </q-btn>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addTextGridItem('Conclusion')"> Add Conclusion </q-btn>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addImageGridItem"> Add Image </q-btn>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addQuoteItem"> Add Quote </q-btn>
    <q-btn
      v-if="!preview"
      class="block w-full"
      @click="documentStore.addDateItem"> Add Date </q-btn>

    <q-btn
      class="block w-full"
      @click="documentStore.togglePreview">
      <span v-if="preview"> Edit </span>
      <span v-else> Preview </span>
    </q-btn>

    <q-btn
      v-if="preview"
      class="block w-full"
      @click="addTemplate">
      Add Template
    </q-btn>
  </div>
</template>
