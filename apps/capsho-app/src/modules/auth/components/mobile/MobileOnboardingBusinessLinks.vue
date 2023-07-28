<script setup lang="ts">
import { laFacebook, laInstagram, laLinkedin, laLinkSolid, laTwitterSquare, laYoutube } from '@quasar/extras/line-awesome'
import { useAuthStore } from 'stores/auth-store'

import MobileAuthCard from 'src/modules/auth/components/mobile/MobileAuthCard.vue'

const authStore = useAuthStore()
async function onSubmit () {
  await authStore.saveUser()
}
</script>

<template>
  <MobileAuthCard
    centered
    sub-title="This is so we can automatically add them to show notes"
    title="Now Let's Grab Your Social Media And Website Links">
    <template #body>
      <q-form @submit="onSubmit">
        <div class="full-width">
          <div class="q-gutter-y-sm">
            <q-input
              v-model="authStore.instagramLink"
              class="input"
              lazy-rules="ondemand"
              outlined
              standout>
              <template #before>
                <q-icon
                  :name="laInstagram"
                  size="lg" />
              </template>
            </q-input>
            <q-input
              v-model="authStore.facebookLink"
              class="input"
              lazy-rules="ondemand"
              outlined
              standout>
              <template #before>
                <q-icon
                  :name="laFacebook"
                  size="lg" />
              </template>
            </q-input>
            <q-input
              v-model="authStore.youtubeLink"
              class="input"
              lazy-rules="ondemand"
              outlined
              standout>
              <template #before>
                <q-icon
                  :name="laYoutube"
                  size="lg" />
              </template>
            </q-input>
            <q-input
              v-model="authStore.twitterLink"
              class="input"
              lazy-rules="ondemand"
              outlined
              standout>
              <template #before>
                <q-icon
                  :name="laTwitterSquare"
                  size="lg" />
              </template>
            </q-input>
            <q-input
              v-model="authStore.linkedinLink"
              class="input"
              lazy-rules="ondemand"
              outlined
              standout>
              <template #before>
                <q-icon
                  :name="laLinkedin"
                  size="lg" />
              </template>
            </q-input>
            <q-input
              v-model="authStore.websiteLink"
              class="input"
              lazy-rules="ondemand"
              outlined
              standout>
              <template #before>
                <q-icon
                  :name="laLinkSolid"
                  size="lg" />
              </template>
            </q-input>
          </div>
        </div>
        <div class="text-center">
          <h2 class="text-h6 text-weight-bold text-capitalize text-darkish">And Finally, Please Add A Link To Your Podcast Review Page (If You Have One)</h2>
          <span class="text-label text-weight-medium text-body1">This will also be automatically added to your show notes</span>
          <div class="q-gutter-y-sm q-py-md">
            <q-input
              v-model="authStore.podcastLink"
              class="input"
              lazy-rules="ondemand"
              outlined
              standout/>
          </div>
        </div>
        <div class="row justify-end q-py-lg" >
          <q-btn
            class="button-shape full-width q-py-md text-weight-bold shadow"
            color="accent"
            label="Next"
            no-caps
            type="submit"
            unelevated
          />
        </div>
      </q-form>
    </template>
  </MobileAuthCard>
</template>
