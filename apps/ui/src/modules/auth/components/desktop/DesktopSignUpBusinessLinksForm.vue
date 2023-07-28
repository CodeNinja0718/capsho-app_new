<script setup lang="ts">
import { laFacebook, laInstagram, laLinkedin, laLinkSolid, laTwitterSquare, laYoutube } from '@quasar/extras/line-awesome'
import { useAuthStore } from 'stores/auth-store'
import { computed, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const getWidthStyle = computed<string>(() => {
  if ($q.screen.lt.md) return '65vw'
  else return '55vw'
})
const styleObject = reactive<object>({
  width: getWidthStyle
})
const authStore = useAuthStore()
async function onSubmit () {
  await authStore.saveUser()
}
</script>

<template>
  <q-form @submit="onSubmit"
  >
    <div class="full-width">
      <p class="text-capitalize text-subtitle1 text-center inter-regular text-weight-medium text-grey-7">This is so we can automatically add them to show notes</p>
      <div class="q-gutter-y-sm">
        <q-input
          v-model="authStore.instagramLink"
          dense
          outlined>
          <template #before>
            <q-icon
              :name="laInstagram"
              size="lg" />
          </template>
        </q-input>
        <q-input
          v-model="authStore.facebookLink"
          dense
          outlined>
          <template #before>
            <q-icon
              :name="laFacebook"
              size="lg" />
          </template>
        </q-input>
        <q-input
          v-model="authStore.youtubeLink"
          dense
          outlined>
          <template #before>
            <q-icon
              :name="laYoutube"
              size="lg" />
          </template>
        </q-input>
        <q-input
          v-model="authStore.twitterLink"
          dense
          outlined>
          <template #before>
            <q-icon
              :name="laTwitterSquare"
              size="lg" />
          </template>
        </q-input>
        <q-input
          v-model="authStore.linkedinLink"
          dense
          outlined>
          <template #before>
            <q-icon
              :name="laLinkedin"
              size="lg" />
          </template>
        </q-input>
        <q-input
          v-model="authStore.websiteLink"
          dense
          outlined>
          <template #before>
            <q-icon
              :name="laLinkSolid"
              size="lg" />
          </template>
        </q-input>
      </div>
    </div>
    <div>
      <h2 class="text-h6 text-weight-bold text-center text-capitalize">And Finally, Please Add A Link To Your Podcast Review Page (If You Have One)</h2>
      <p class="text-capitalize text-subtitle1 text-center inter-regular text-weight-medium text-grey-7">This will also be automatically added to your show notes</p>
      <div class="q-gutter-y-sm">
        <q-input
          v-model="authStore.podcastLink"
          dense
          outlined />
      </div>
    </div>
    <div
      class="row justify-end q-py-lg"
      :style="styleObject">
      <q-btn
        color="accent"
        label="Next"
        padding="7px 44px"
        rounded
        type="submit"
      />
    </div>
  </q-form>
</template>

<style scoped>

</style>
