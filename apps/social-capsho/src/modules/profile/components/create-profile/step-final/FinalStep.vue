<script setup>
  import CreateProfilePagination from '../CreateProfilePagination.vue'
</script>

<template>
  <div class="bg-white rounded-2xl shadow px-10 py-10">
    <div class="flex flex-col items-center">
      <iframe
        src="https://player.vimeo.com/video/611198993?h=58b059483b"
        width="890"
        height="500"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen
      />
      <CreateProfilePagination />
    </div>
  </div>
</template>
