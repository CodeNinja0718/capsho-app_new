<script setup lang="ts">
import 'v-onboarding/dist/style.css'

defineProps({
  step: {
    required: true,
    type: Object
  },
  top: {
    type: String,
    required: false,
    default: '42px'
  },
  right: {
    type: String,
    required: false
  },
  bottom: {
    type: String,
    required: false
  }
})

const emit = defineEmits(['next', 'previous'])

</script>

<template>
  <div
    :class="`onboard-step ${step.tooltipPosition}`"
    :style="`top: ${top}; right: ${right}; bottom: ${bottom}; width:${step.width}`">
    <div v-if="step.description">
      <p v-html="step.description"></p>
    </div>
    <div class="footer-btn">
      <template v-if="!step.isFirst">
        <q-btn
          flat
          label="Previous"
          style="color: #6E7191"
          @click="emit('previous', step)" />
      </template>
      <q-btn
        flat
        :label="step.isLast ? 'Got it!' : 'Next'"
        style="color: #6267DA"
        @click="emit('next', step)" />
    </div>
  </div>
</template>

<style lang="scss">
.top-right-180::before {
  content: '';
  background: #F5F4FF;
  top: 50px;
  left: -5px;
  transition: transform 0.2s ease-out, visibility 0.2s ease-out;
  visibility: visible;
  transform: translateX(0px) rotate(45deg);
  transform-origin: center;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: -1;
}
.top-left-42::before {
  content: '';
  background: #F5F4FF;
  top: -5px;
  left: 42px;
  transition: transform 0.2s ease-out, visibility 0.2s ease-out;
  visibility: visible;
  transform: translateX(0px) rotate(45deg);
  transform-origin: center;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: -1;
}

.top-right-12::before {
  content: '';
  background: #F5F4FF;
  top: -5px;
  right: 12px;
  transition: transform 0.2s ease-out, visibility 0.2s ease-out;
  visibility: visible;
  transform: translateX(0px) rotate(45deg);
  transform-origin: center;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: -1;
}

.top-right-40::before {
  content: '';
  background: #F5F4FF;
  top: -5px;
  right: 40px;
  transition: transform 0.2s ease-out, visibility 0.2s ease-out;
  visibility: visible;
  transform: translateX(0px) rotate(45deg);
  transform-origin: center;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: -1;
}
.top-right-150::before {
  content: '';
  background: #F5F4FF;
  top: -5px;
  right: 150px;
  transition: transform 0.2s ease-out, visibility 0.2s ease-out;
  visibility: visible;
  transform: translateX(0px) rotate(45deg);
  transform-origin: center;
  width: 10px;
  height: 10px;
  position: absolute;
  z-index: -1;
}

.onboard-step {
  position: absolute;
  z-index: 1;
  background: #F5F4FF;
  border-radius: 16px;
  max-width: 320px;
  padding: 24px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0.75px;
  color: #14142B;
}

.footer-btn {
  display: flex;
  justify-content: center
}
</style>
