<template>
  <audio
    ref="audioPlayer"
    :src="episode.url"
    preload="auto"
  />
  <div class="text-white">
    <div class="flex flex-row justify-between">
      <button @click="goback">
        Back
      </button>
      <div class="text-yellow-300 font-bold text-1xl">
        Podcast Player
      </div>
    </div>
    <div>
      <div class="text-center">
        <p class="text-yellow-300 font-bold">
          {{ episode.title }}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-3 mt-10">
      <div class="flex items-center justify-center">
        <button @click="previous">
          Previous
        </button>
      </div>
      <div class="flex items-center justify-center">
        <button
          class="rounded-full bg-yellow-300 h-24 w-24 text-black font-bold"
          @click="togglePlay"
        >
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
      </div>
      <div class="flex items-center justify-center">
        <button @click="next">
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PodcastPlayer',
  props: {
    episode: {
      type: Object,
      required: true
    }
  },
  emits: ['goback', 'next', 'previous'],
  data () {
    return {
      isPlaying: true
    }
  },
  methods: {
    goback () {
      this.$emit('goback')
    },
    togglePlay () {
      if (this.isPlaying) {
        this.$refs.audioPlayer.pause()
      } else {
        this.$refs.audioPlayer.play()
      }

      this.isPlaying = !this.isPlaying
    },
    next () {
      this.$emit('next')
    },
    previous () {
      this.$emit('previous')
    }
  }
}
</script>