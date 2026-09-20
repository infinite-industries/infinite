<template>
  <!-- Background -->
  <transition name="fade">
    <div
      v-if="modelValue"
      class="modal-background"
      @click="close"
    ></div>
  </transition>

  <!-- Modal Container -->
  <transition name="slide-up">
    <div
      v-if="modelValue"
      class="modal-container"
      :style="{ maxWidth: maxWidth }"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      @click.stop
    >
      <!-- Header -->
      <div class="modal-header">
        <h2 id="modal-title">{{ title }}</h2>
        <button class="close-btn" @click="close" aria-label="Close modal">&times;</button>
      </div>

      <!-- Body (Default Slot) -->
      <div class="modal-body">
        <slot></slot>
      </div>

      <!-- Pinned Footer (Named Slot) -->
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
  import { watch, onMounted, onBeforeUnmount } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: 'Modal Title'
    },
    maxWidth: {
      type: String,
      default: '700px'
    }
  })

  const emit = defineEmits(['update:modelValue'])

  const close = () => {
    emit('update:modelValue', false)
  }

  const handleEscapeKey = (e) => {
    if (e.key === 'Escape' && props.modelValue) {
      close()
    }
  }

  watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  })

  onMounted(() => {
    window.addEventListener('keydown', handleEscapeKey)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleEscapeKey)
    // Clean up scroll lock in case component is destroyed while open
    document.body.style.overflow = ''
  })
</script>

<style scoped>
  .modal-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 1000;
  }

  .modal-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 8px;
    width: 90%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    z-index: 1001;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #e0e0e0;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    line-height: 1;
    padding: 0 4px;
  }

  .close-btn:hover {
    color: #000;
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex-grow: 1;
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 15px;
  }

  /* Transitions */
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active, .slide-up-leave-active {
    transition: all 0.3s ease;
  }
  .slide-up-enter-from, .slide-up-leave-to {
    opacity: 0;
    transform: translate(-50%, -45%);
  }
</style>
