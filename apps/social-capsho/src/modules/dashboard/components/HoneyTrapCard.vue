<template>
  <div
    class="cursor-pointer honey-trap-card col-md-4"
    @click="[
      route.query
        ? $router.push({ name: route.name, query: { type: route.query } })
        : $router.push({ name: route.name, params: { tool: route.params } })
    ]"
  >
    <div class="info">
      <div class="block rounded-lg border bg-info text-grey-9 shadow-sm hover:shadow-lg text-white focus:shadow-lg max-w-sm h-full">
        <div class="inner">
          <h3
            v-if="$route.query.type"
            class="sub-title font-body"
          >
            {{ $route.query.type === 'guest' ? 'GUEST' : 'NO GUEST' }}
          </h3>
          <h2 class="text-base heading font-bodyLexend leading-tight font-bold">
            {{ title }}
          </h2>
          <p class="font-body content mb-4">
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    route: {
      type: Object,
      required: true
    }
  })
</script>

<style>
.inner {
  padding: 30px;
}
.heading {
  font-size: 1.1rem;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
}
.sub-title {
  font-size: 12px;
  font-style: normal;
  font-variant-ligatures: normal;
  font-variant-caps: normal;
  font-variant-numeric: normal;
  font-weight: normal;
  font-stretch: normal;
  line-height: 1;
}
.content {
  font-size: 16px;
}

.honey-trap-card {
  position: relative;
  min-height: 1px;
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 30px;
}

.info {
  height: 230px !important;
}

@media (min-width: 992px) {
  .col-md-4 {
    width: 33.3333%;
  }
}
</style>
