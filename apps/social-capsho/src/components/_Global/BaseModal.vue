<script setup>
import { reactive, ref, watch } from 'vue'
import { useOnClickOutside } from '@/composables/useOnClickOutside'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  modalContainer: {
    type: Object,
    default: () => ({
      width: '350px',
      height: '230px'
    })
  }
})

const emit = defineEmits(['onModalClose'])

const modal = ref(null)
const { onClickOutside } = useOnClickOutside()

function closeModal() {
  emit('onModalClose')
  showModal.value = false
}

onClickOutside(modal, () => {
  if (showModal.value === true) {
    closeModal()
  }
})

const modalContainerStyle = reactive({
  width: props.modalContainer.width,
  height: props.modalContainer.height
})

const showModal = ref(false)
watch(
  () => props.show,
  show => {
    showModal.value = show
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition
      name="modal"
      enter-active-class="transition ease-out duration-200 transform"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200 transform"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-show="showModal"
        ref="modal-backdrop"
        class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
      >
        <div
          class="flex items-center justify-center min-h-screen text-center"
        >
          <transition
            enter-active-class="transition ease-out duration-300 transform "
            enter-from-class="opacity-0 translate-y-10 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-10 translate-y-0 scale-95"
          >
            <div
              ref="modal"
              class="modal-wrapper overflow-hidden shadow-xl p-1"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div
                class="modal-container flex flex-col justify-between"
                :style="modalContainerStyle"
              >
                <div class="modal-header">
                  <slot name="header" />
                </div>

                <div class="modal-body">
                  <slot name="body" />
                </div>

                <div class="modal-footer">
                  <slot name="footer" />
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  margin: 0 auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
