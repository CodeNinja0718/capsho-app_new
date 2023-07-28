<script setup>
  import BrandLogoUpload from './BrandLogoUpload.vue'
  import ToneList from './ToneList.vue'
  import TypeList from './TypeList.vue'
  import CreateProfilePagination from '../CreateProfilePagination.vue'
  import { useCreateProfile } from '../../../composables/useCreateProfile'

  const { profileCreatorsName, profileBusinessName } = useCreateProfile()
</script>

<template>
  <div class="bg-white rounded-2xl shadow px-10 py-10">
    <div class="flex flex-col">
      <span class="font-heading text-xl">Let's get you started</span>
      <label
        for="profileCreatorsName"
        class="block text-left text-formLabel font-formText pb-2"
      >
        Full name
      </label>
      <input
        id="profileCreatorsName"
        v-model="profileCreatorsName"
        type="text"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        placeholder="First and last name"
      >
      <label
        for="profileBusinessName"
        class="block text-left text-formLabel font-formText pb-2"
      >
        Business name
      </label>
      <input
        id="profileBusinessName"
        v-model="profileBusinessName"
        type="text"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        placeholder="Business name"
      >
      <BrandLogoUpload />
    </div>
    <ToneList />
    <TypeList />
    <CreateProfilePagination />
  </div>
</template>
