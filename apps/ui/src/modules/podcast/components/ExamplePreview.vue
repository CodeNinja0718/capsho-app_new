<script setup lang="ts">
import { PropType } from 'vue'

interface BlogExample {
  name: string,
  title: string,
  content: string
}

defineProps({
  blogExample: {
    type: Object as PropType<BlogExample>,
    default: () => ({})
  }
})

</script>
<template>
  <q-card class="example-card">
    <q-card-section>
      <p class="text-h6 example-title">{{ blogExample.title }}</p>
      <q-btn
        v-close-popup
        class="close-icon"
        dense
        flat
        icon="close"
        round />
    </q-card-section>

    <q-card-section
      class="scroll"
      style="max-height: 50vh">
      <div
        class="example-content"
        v-html="blogExample.content"></div>
    </q-card-section>
  </q-card>
</template>
<style scoped lang="scss">
.example-card{
  border-radius: 40px;
  background-color: $secondary-dark;
  color: white;
  font-family: 'Lexend';
  padding: 20px 20px 40px;
  .example-title{
    background-color: $dark;
    border-radius: 20px;
    width: fit-content;
    padding: 5px 10px;
    margin: auto;
  }
  .close-icon{
    position: absolute;
    top: 10px;
    right: 10px
  }
  .example-content{
    font-size: 16px;
  }
  // scrollbar
  /* width */
  ::-webkit-scrollbar {
    width: 5px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: $dark;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #b30000;
  }
}
</style>
