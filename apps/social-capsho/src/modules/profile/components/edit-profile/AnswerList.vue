<script setup>
  import { useSets } from '../../composables/useSets'
  import AnswersPagination from './AnswersPagination'
  import AppNotification from '@/components/AppNotificationList'
  import { usePagination } from '../../composables/usePagination'
  import BaseModal from '@/components/_Global/BaseModal.vue'
  import { ref } from 'vue'
  import { useNotification } from '@/composables/useNotification'

  const { getSingleSet, setIsEnabled, removeSet } = useSets()
  const { setsPerPage, searchQuery, selectQuery } = usePagination()

  const selectToolOptions = ref([
    {
      label: 'Promised Land',
      value: 'promised_land'
    },
    {
      label: 'The Rebel Guest',
      value: 'the_rebel_guest_captions'
    },
    {
      label: 'The Jawdropper Guest',
      value: 'the_jawdropper_guest_captions'
    },
    {
      label: 'The Marvel Guest',
      value: 'the_marvel_guest_captions'
    },
    {
      label: 'The Boxer Guest',
      value: 'the_boxer_guest_captions'
    },
    {
      label: 'The Paradox Guest',
      value: 'the_paradox_guest_captions'
    },
    {
      label: 'The Cliffhanger Guest',
      value: 'the_cliffhanger_guest_captions'
    },
    {
      label: 'The Big Reveal Guest',
      value: 'the_big_reveal_guest_captions'
    },
    {
      label: 'The Sharer Guest',
      value: 'the_sharer_guest_captions'
    },
    {
      label: 'The Rebel',
      value: 'the_rebel_captions'
    },
    {
      label: 'The Jawdropper',
      value: 'the_jawdropper_captions'
    },
    {
      label: 'The Marvel',
      value: 'the_marvel_captions'
    },
    {
      label: 'The Boxer',
      value: 'the_boxer_captions'
    },
    {
      label: 'The Paradox',
      value: 'the_paradox_captions'
    },
    {
      label: 'The Cliffhanger',
      value: 'the_cliffhanger_captions'
    },
    {
      label: 'The Big Reveal',
      value: 'the_big_reveal_captions'
    },
    {
      label: 'The Sharer',
      value: 'the_sharer_captions'
    },
    {
      label: 'About Me',
      value: 'about_me'
    },
    {
      label: 'How To',
      value: 'how_to'
    },
    {
      label: 'Striking Memory',
      value: 'striking_memory'
    },
    {
      label: 'Moment in time',
      value: 'moment_in_time'
    },
    {
      label: 'Product Spotlight',
      value: 'product_spotlight'
    }
  ].sort((a, b) => a.label < b.label ? -1 : 1))
  const selectedSet = ref({})
  const showModal = ref(false)
  const processing = ref(false)
  const handleDelete = async (set) => {
    processing.value = true
    const { alertDanger, alertPrimary } = useNotification()
    try {
      await removeSet(set.name)
      processing.value = false
      alertPrimary('Deleted ' + set.title)
      showModal.value = false
    } catch (e) {
      alertDanger(e.message)
    }
  }
  const confirmDelete = (set) => {
    showModal.value = true
    selectedSet.value = set
  }
</script>

<template>
  <div
    class="flex flex-col overflow-y-auto pt-8"
  >
    <h1 class="font-heading font-bold text-left text-2xl">
      Answer sets
    </h1>

    <div class="row no-wrap q-gutter-x-sm justify-between">
      <base-input
        v-model="searchQuery"
        placeholder="search answer sets"
        class="col-4 rounded-lg border-gray-200"
      />
      <select
        v-model="selectQuery"
        aria-label="Filter the results"
        class="form-select
        appearance-none
        block
        w-full
        px-3
        py-1.5
        text-base
        font-normal
        text-gray-700
        bg-white bg-clip-padding bg-no-repeat
        border border-solid border-gray-200
        rounded-lg
        transition
        ease-in-out
        m-0
        focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
      >
        <option
          selected
          value="all"
        >
          All
        </option>
        <option
          v-for="(option, idx) in selectToolOptions"
          :key="idx"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <div
      v-for="(set, i) in setsPerPage"
      :key="i"
      class="flex flex-row bg-gradient-to-br from-white to-primaryLight border border-backgroundGradient rounded-2xl py-4 px-4 my-2 justify-between"
    >
      <div class="flex flex-col text-left">
        <span class="capitalize">{{ set?.title }}</span>
        <span>Created at: {{ set?.createdAt }}</span>
      </div>
      <div class="flex flex-row">
        <button
          class="px-4 py-2 rounded-full text-primaryDark border border-primaryDark"
          @click="getSingleSet(set)"
        >
          Show answers
        </button>
        <div class="flex flex-row items-center pl-8">
          <input
            :checked="set.enabled"
            type="checkbox"
            class="rounded text-primaryDark border-primaryLight"
            @change="setIsEnabled(set.name)"
          >
          <span
            class="pl-2 "
            :class="[ set.enabled ? 'text-primaryDark' : 'text-formLabel' ]"
          >{{ set.enabled ? 'Enabled' : 'Disabled' }}</span>
          <span
            class="text-gray-400 hover:text-red-500 cursor-pointer px-3"
            @click="confirmDelete(set)"
          >
            <font-awesome-icon
              :icon="[ 'fa', 'trash' ]"
              size="lg"
            />
          </span>
        </div>
      </div>
    </div>
    <BaseModal
      :show="showModal"
      :modal-container="{ height: '230px', width: '350px' }"
      @onModalClose="showModal = !showModal"
    >
      <template #header>
        <h1 class="font-bold text-lg text-primaryDark font-bodyLexend mb-6">
          Are you sure you want to delete
          <span class="capitalize">{{ selectedSet?.title + '?' }}</span>
        </h1>
      </template>
      <template #footer>
        <button
          v-if="processing"
          type="button"
          class="bg-secondaryDark text-white flex justify-center items-center py-1.5 pr-3 rounded-full modal-default-button"
          disabled
        >
          <div
            class="spinner-border animate-spin inline-block w-5 h-5 mx-3 border-3 rounded-full"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          Deleting...
        </button>
        <button
          v-else
          type="button"
          class="mx-2 font-body font-bold rounded-full bg-secondaryDark text-white hover:bg-yellow-400 py-1.5 px-8 modal-default-button"
          @click="handleDelete(selectedSet)"
        >
          Delete
        </button>
        <button
          type="button"
          class="mx-2 font-body font-bold rounded-full bg-primaryDark hover:bg-indigo-600 py-1.5 px-8 modal-default-button"
          @click="showModal = false"
        >
          <span class="text-white">Cancel</span>
        </button>
      </template>
    </BaseModal>
    <div class="flex flex-row items-center py-4">
      <AnswersPagination />
    </div>
    <AppNotification message="Preferences updated" />
  </div>
  <div
    v-if="!setsPerPage.length"
    class="flex justify-center items-center h-96"
  >
    <div class="m-auto">
      Nothing is here
    </div>
  </div>
</template>

<style>
.material-icons {
  color: #950B02;
}
</style>
