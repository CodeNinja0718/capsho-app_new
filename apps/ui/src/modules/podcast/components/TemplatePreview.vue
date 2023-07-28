<script setup lang="ts">
import { PropType, computed } from 'vue'
import { TemplateV2 } from 'src/models/template'

const props = defineProps({
  templateExample: {
    type: Object as PropType<TemplateV2>,
    default: () => ({})
  }
})

const contents = computed(() => {
  return props.templateExample.layout.content.map(con => con.attrs.label)
})

const getClassName = (content: string) => {
  if (content.includes('Title')) {
    return 'title'
  } else if (content.includes('Introduction')) {
    return 'intro'
  } else if (content.includes('Image')) {
    return 'image'
  } else if (content.includes('Bio')) {
    return 'bio'
  } else if (content.includes('Text')) {
    return 'text'
  } else if (content.includes('Subheading')) {
    return 'subheading'
  } else if (content.includes('Detail')) {
    return 'detail'
  } else if (content.includes('Conclusion')) {
    return 'conclusion'
  } else if (content.includes('action')) {
    return 'action'
  } else if (content.includes('Link')) {
    return 'link'
  } else {
    return 'text'
  }
}

</script>
<template>
  <q-card
    class="example-card"
    style="width: 800px; max-width: 80vw;">
    <q-card-section>
      <p class="text-h6 example-title">Preview of {{ templateExample.title }}</p>
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
        v-for="(content, index) in contents"
        :key="index">
        <div
          v-if="content !== 'Image'"
          class="example-content"
          :class="getClassName(content)">
          {{content}}
        </div>
        <div v-else>
          <div
            class="example-content"
            :class="getClassName(content)">
            <q-icon
              name="add"
              size="md"></q-icon>
            <span>{{ content }}</span>
          </div>
        </div>
      </div>
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
    margin: 20px;
    padding: 10px 30px;
    color: grey;
    background: $dark;
    border-radius: 20px;
    &.title{
      height: 40px;
    }
    &.intro{
      height: 100px;
    }
    &.image{
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &.bio{
      height: 70px;
    }
    &.text{
      height: 120px;
    }
    &.subheading{
      height: 40px;
    }
    &.detail{
      height: 100px;
    }
    &.conclusion{
      height: 160px;
    }
    &.action{
      height: 50px;
    }
    &.link{
      height: 100px;
    }
    &.text{
      height: 180px;
    }
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
