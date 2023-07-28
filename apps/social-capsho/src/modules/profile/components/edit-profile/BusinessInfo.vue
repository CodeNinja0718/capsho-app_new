<script setup>
  import { computed } from 'vue'
  import { useUser } from '@/composables/useUser'
  import { useTones } from '../../composables/useTones'
  import UploadImage from '@/components/UploadImage'

  const { user, updateBusinessName, updateToneIfVoice, } = useUser()
  const { tones } = useTones()

  const businessName = computed({
    get() {
      return user.value.businessName
    },
    set(value) {
      updateBusinessName(value)
    }
  })

  const toneOfVoice = computed({
    get() {
      return user.value.toneOfVoice
    },
    set(value) {
      updateToneIfVoice(value)
    }
  })
</script>

<template>
  <div
    v-if="businessName"
    class="flex flex-col py-8"
  >
    <span class="font-heading text-3xl text-left pb-2">Company Info</span>
    <div class="flex flex-col py-4">
      <base-input
        v-model="businessName"
        class="appearance-none bg-backgroundGradient rounded-xl w-full py-4 px-4 text-primaryDark border-0 focus:outline-none focus:shadow-outline"
        placeholder="Business name"
        label="Business name"
        label-class="block text-left text-formLabel font-formText pb-2"
      />
    </div>
    <div class="flex flex-col py-4">
      <UploadImage />
      <label class="block text-left text-formLabel font-formText pt-2">When uploading a new photo, your current one will be deleted</label>
    </div>
    <div class="flex flex-col py-4">
      <label class="block text-left text-formLabel font-formText pb-2">Tone of voice</label>
      <base-select
        v-model="toneOfVoice"
        :options="tones"
        option-class="capitalize"
      />
    </div>
  </div>
</template>
