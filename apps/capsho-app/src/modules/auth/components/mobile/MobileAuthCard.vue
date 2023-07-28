<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  },
  subTitle: {
    type: String,
    required: false,
    default: ''
  },
  centered: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>

<template>
  <div class="outer flex flex-center q-px-md q-py-md">
    <q-card
      class="app-card row items-center inter-regular full-width"
      flat>
      <q-card-section
        v-if="title"
        class="col-12 q-pa-lg"
        :class="{'text-center': centered}">
        <h1 class="text-h5 text-weight-bold text-capitalize q-my-none text-darkish q-mb-sm">{{title}}</h1>
        <span
          v-if="subTitle"
          class="text-label text-weight-medium text-body1">{{subTitle}}</span>
      </q-card-section>
      <q-card-section class="col-12 q-px-lg">
        <slot name="body"></slot>
      </q-card-section>
    </q-card>
  </div>
</template>

<style lang="scss" scoped>
.outer {
  border-radius: 50px;
  width: 100%;
  margin: 0 auto;
}
.app-card {
  border-radius: 16px;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.03) !important;
}
:deep .input > .q-field__inner {
  .q-field__control {
    border-radius: 6px !important;
    border: 0.5px solid #EAEAF9;
    background: #F9F9FF;
  }
}
:deep .input.q-field--focused {
  .q-field__inner {
    box-shadow: 0 10px 24px rgba(98, 103, 218, 0.16) !important;
  }
}

:deep .q-field--outlined .q-field__control:before {
  border: none !important
}

:deep .button-shape {
  border: 0.5px solid #EAEAF9;
  border-radius: 6px;
}
.shadow {
  box-shadow: 0 16px 35px rgba(98, 103, 218, 0.1);
}

</style>
