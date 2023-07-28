<script setup lang="ts">
import GuestSignUpForm from 'src/modules/auth/components/desktop/GuestDesktopSignUpEmailPasswordForm.vue'
import { onMounted, ref } from 'vue'
import { LocationQuery, useRoute } from 'vue-router'

const userType = ref('')
const guestName = ref('')
const hostName = ref('')
const podcastName = ref('')
function analysisQuery(params: LocationQuery) {
  userType.value = (params.userType || '') as string
  guestName.value = (params.guestName || '') as string
  hostName.value = (params.hostName || '') as string
  podcastName.value = (params.podcastName || '') as string
}

const route = useRoute()

const query = ref(route.query)

onMounted(() => {
  analysisQuery(query.value)
})
</script>

<template>
  <section class="q-pa-xl poppins-regular row no-wrap justify-center items-center">
    <div class="col-6 hidden">
      <h3 class="poppins-medium text-22">
        What {{ hostName }} has sent you is just the start.
      </h3>
      <p>
        You can customize and edit these
        templates. The best part is, Capsho will
        already have created drafts for you.
      </p>
      <p>
        You can also create a TON of
        other marketing copies.
      </p>
    </div>
    <div class="col-6">
      <q-card
        class="auth-card"
        flat
      >
        <q-card-section>
          <h1 class="text-bold text-22 q-my-sm">
            Hey {{ guestName }}!
          </h1>
          <p class="text-16 text-grey-4">
            {{ hostName }} has sent you your Capsho Guest Media kit
            for your recent episode on {{ podcastName }}
          </p>
        </q-card-section>
        <q-card-section>
          <h2 class="text-bold">Experience the Capsho <span class="text-accent">magic.</span></h2>
          <p class="text-13 text-grey-4">
            Create your free account to unlock the free gift from {{ hostName }}
          </p>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <GuestSignUpForm :is-guest="true" />
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  background-color: $app-header;
  color: #FFFFFF;
  height: 100vh;
}

h1 {
  margin-bottom: 0;
  padding-bottom: 0;
}

h2 {
  font-size: 2rem;
  margin-bottom: 0;
}

.auth-card {
  background-color: $app-header;
}

.col-6 {
  width: 100%;
  max-width: 550px;
}
</style>
