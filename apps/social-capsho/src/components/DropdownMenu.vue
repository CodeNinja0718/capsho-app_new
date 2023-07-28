<script setup>
  import DropdownMenuList from './DropdownMenuList.vue'
  import DropdownMenuHeader from './DropdownMenuHeader.vue'
  import UserIcon from './UserIcon.vue'
</script>

<template>
  <div class="flex flex-1 flex-row flex-wrap items-center justify-end py-2">
    <div class="static">
      <q-btn round>
        <q-avatar size="42px">
          <UserIcon />
        </q-avatar>
        <q-menu>
          <DropdownMenuHeader />

          <DropdownMenuList />
        </q-menu>
      </q-btn>
      <!--      <button-->
      <!--          v-show="false"-->
      <!--        class="font-body font-bold text-primaryDark hover:bg-offWhite rounded-full py-2 px-4 ml-3"-->
      <!--        @click="dropdown = !dropdown"-->
      <!--      >-->
      <!--        <UserIcon class="h-5" />-->
      <!--      </button>-->
      <!--      <div-->
      <!--        v-if="dropdown"-->
      <!--        class="absolute right-5 top-15 flex flex-col bg-white border border-primaryLight shadow rounded-2xl mt-2 z-50"-->
      <!--      >-->
      <!--        <DropdownMenuHeader />-->

      <!--        <DropdownMenuList />-->
      <!--      </div>-->
    </div>
  </div>
</template>
