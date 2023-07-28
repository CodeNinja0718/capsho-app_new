<script setup>
  import CreateProfilePagination from '../CreateProfilePagination.vue'
  import { useCreateProfile } from '../../../composables/useCreateProfile'

  const { profileCreatorsExpectation } = useCreateProfile()
</script>

<template>
  <div class="bg-white rounded-2xl shadow px-10 py-10">
    <div class="flex flex-col">
      <div class="flex flex-row pb-4">
        <span class="font-heading text-left text-2xl">If you could have a magic wand to wave over Capsho and get exactly what you want, what would you wish for?</span>
      </div>
      <textarea
        id="comment"
        v-model="profileCreatorsExpectation"
        class="appearance-none border-0 bg-backgroundGradient rounded-xl resize-none w-full py-4 px-4 text-primaryDark focus:outline-none focus:shadow-outline"
        rows="5"
        placeholder="We love meeting (and exceeding!) expectations so let us know what you're looking forward to!"
      />
      <CreateProfilePagination />
    </div>
  </div>
</template>
