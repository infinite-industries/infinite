<template>
  <div class="partner-card">
    <section class="partner-info">
      <h4>{{ partner.name }}</h4>

      <!-- Partner details -->
      <div v-for="field in displayFields" :key="field.key">
        <label class="partner-label">{{ field.label }}:</label>
        <span>{{ field.value }}</span>
      </div>

      <!-- Logo & Upload Section -->
      <div class="logo-section">

        <!-- Loop thru logoConfig to render Light and Dark blocks -->
        <div v-for="logo in logoConfig" :key="logo.type" class="logo-block">

          <!-- Hidden Input triggered by upload-btn -->
          <input
            type="file"
            :ref="(el) => { if (el) logoInputs[logo.type] = el }"
            accept="image/*"
            class="hidden-input"
            @change="handleFileChange($event, logo.type)"
          />

          <div class="upload-row">
            <label class="partner-label">{{ logo.label }}</label>
            <button class="upload-btn" @click="triggerUpload(logo.type)">
              Upload {{ logo.label }}
            </button>
          </div>

          <div class="logo-content">
            <div :class="['img-wrapper', logo.bgClass]">
              <img :src="partner[logo.key] || imgPlaceholder" :alt="logo.label" class="logo-img" />
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'

  const props = defineProps({
    partner: {
      type: Object,
      required: false,
      default: () => ({})
    }
  })

  const emit = defineEmits(['upload-logo'])

  const logoConfig = [
    { type: 'light', label: 'Light Logo', key: 'light_logo_url', bgClass: 'img-wrapper-light' },
    { type: 'dark', label: 'Dark Logo', key: 'dark_logo_url', bgClass: 'img-wrapper-dark' }
  ]

  const logoInputs = ref({})

  const imgPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCAxMDAgNjAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIGZpbGw9IiNlZWVlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: 'numeric',
    })
  }

  const displayFields = computed(() => [
    { key: 'id', label: 'ID', value: props.partner.id },
    { key: 'updatedAt', label: 'Updated At', value: formatDate(props.partner.updatedAt) },
  ])

  // Look up the hidden input ref by dark or light and click it when "Upload"
  const triggerUpload = (type) => {
    logoInputs.value[type]?.click()
  }

  const handleFileChange = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      emit('upload-logo', { partnerId: props.partner.id, type, file })
      event.target.value = ''
    }
  }
</script>

<style scoped>
.partner-card {
  margin-bottom: 1rem;
  border: 2px solid #333;
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.8);
  padding: 1rem;
}

.partner-info {
  display: block;
  width: 100%;
  font-size: larger;
}

.partner-info > div {
  margin-bottom: 0.5rem;
}

label.partner-label {
  font-weight: bold;
  margin-right: 0.5rem;
}

.logo-section {
  margin-top: 1.5rem;
  border-top: 1px dashed #aaa;
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.logo-block {
  flex: 1;
  min-width: 250px;
}

.logo-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.upload-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.upload-row .partner-label {
  flex: 1 1 auto;
  margin: 0;
}

.upload-row .upload-btn {
  flex: 0 0 auto;
}

@media (max-width: 420px) {
  .upload-row {
    flex-direction: column;
    align-items: stretch;
  }
  .upload-row .partner-label {
    margin-bottom: 0.5rem;
  }
  .upload-row .upload-btn {
    width: 100%;
  }
}

.img-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.img-wrapper-light { background-color: #f0f0f0; }
.img-wrapper-dark  { background-color: #333; }

.logo-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background-color: white;
  border: 2px solid #333;
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 2px 2px 0px rgba(0,0,0);
}

.upload-btn:hover {
  transform: translate(-1px, -1px);
  box-shadow: 3px 3px 0px rgba(0,0,0,0.5);
  background-color: #fafafa;
}

.upload-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 0px 0px 0px rgba(0,0,0,0.5);
}

.hidden-input {
  display: none;
}
</style>
