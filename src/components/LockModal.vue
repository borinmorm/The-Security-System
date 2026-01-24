<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="stopLoading"
  >
    <div
      class="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 flex justify-between items-center rounded-t-lg"
      >
        <div class="flex items-center gap-4">
          <img src="@/assets/logo_1.png" alt="Logo 1" class="h-16 object-contain" />
          <img src="@/assets/logo_2.png" alt="Logo 2" class="h-16 object-contain" />
          <div class="flex items-center gap-3">
            <div>
              <h2 class="text-3xl font-bold">Security System (IT) Department</h2>
              <p class="text-blue-100 text-sm mt-1">Account Lockdown & Verification</p>
            </div>
          </div>
        </div>
        <button @click="closeModal" class="text-white hover:bg-blue-800 p-3 rounded-lg transition">
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-8">
        <div class="grid grid-cols-5 gap-8">
          <!-- Left Side - Form -->
          <div class="col-span-2">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4">Account Information</h3>
                <div class="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <!-- Name -->
                  <div class="space-y-2">
                    <label class="font-semibold text-gray-700 text-sm block">Name</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      placeholder="Enter full name"
                      class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-transparent"
                    />
                  </div>

                  <!-- Order ID -->
                  <div class="space-y-2">
                    <label class="font-semibold text-gray-700 text-sm block">Order ID</label>
                    <input
                      v-model="formData.orderId"
                      type="text"
                      placeholder="Enter order ID"
                      class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-transparent"
                    />
                  </div>

                  <!-- Phone Number -->
                  <div class="space-y-2">
                    <label class="font-semibold text-gray-700 text-sm block">Phone Number</label>
                    <input
                      v-model="formData.phoneNumber"
                      type="text"
                      placeholder="Enter phone number"
                      class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Side - ID Card Upload -->
          <div class="col-span-3">
            <div class="space-y-4">
              <div>
                <h3 class="text-lg font-bold text-gray-800 mb-4">ID Card Verification</h3>
                <div class="relative">
                  <!-- ID Card Container -->
                  <div
                    ref="idCardContainer"
                    class="relative w-full h-80 border-3 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 cursor-pointer hover:border-blue-400 hover:from-blue-50 hover:to-gray-100 transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500"
                    @click="!isLocked && triggerFileInput()"
                    @paste="handlePaste"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                    @keydown="handleKeydown"
                    :class="{ 'border-blue-500 from-blue-50 to-blue-100': isDragging }"
                    tabindex="0"
                  >
                    <img
                      v-if="idCardImage"
                      :src="idCardImage"
                      alt="ID Card"
                      class="w-full h-full object-cover"
                    />

                    <div v-if="!idCardImage" class="text-center pointer-events-none">
                      <div
                        class="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3"
                      >
                        <UploadCloudIcon class="w-8 h-8 text-blue-600" />
                      </div>
                      <p class="text-gray-700 font-semibold text-sm mb-1">Upload ID Card</p>
                      <p class="text-gray-500 text-xs">Click, paste, or drag</p>
                    </div>

                    <!-- Processing State Overlay -->
                    <div
                      v-if="isProcessing && idCardImage"
                      class="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent rounded-xl flex items-center justify-center"
                    >
                      <div class="text-center bg-white/95 px-6 py-4 rounded-lg shadow-lg">
                        <div
                          class="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"
                        ></div>
                        <p class="text-gray-700 font-semibold text-sm">Processing...</p>
                      </div>
                    </div>

                    <!-- Lock Overlay - Enhanced Design -->
                    <div
                      v-if="isLocked"
                      class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent rounded-xl flex items-center justify-center"
                    >
                      <div class="text-center">
                        <div
                          class="mx-auto mb-4 bg-red-500 rounded-full p-4 w-20 h-20 flex items-center justify-center shadow-2xl animate-pulse"
                        >
                          <LockIcon class="w-10 h-10 text-white" />
                        </div>
                        <h3 class="text-white text-2xl font-bold mb-2">ACCOUNT LOCKED</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hidden File Input -->
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Processing Overlay -->
    <div
      v-if="isProcessing"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center gap-4">
        <div
          class="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"
        ></div>
        <p class="text-xl font-semibold text-gray-700">Verifying Account...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ShieldIcon, XIcon, UploadCloudIcon, LockIcon, CheckCircleIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  customer: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const showModal = ref(false)
const isProcessing = ref(false)
const isLocked = ref(false)
const isDragging = ref(false)
const idCardImage = ref(null)
const fileInput = ref(null)
const idCardContainer = ref(null)

const formData = ref({
  name: '',
  orderId: '',
  phoneNumber: '',
})

// Watch for isOpen prop changes
watch(
  () => props.isOpen,
  (newVal) => {
    showModal.value = newVal
    if (newVal && props.customer) {
      formData.value.name = props.customer.name || ''
      formData.value.phoneNumber = props.customer.phone || ''
    }
    // Focus the ID card container when modal opens
    if (newVal) {
      setTimeout(() => {
        idCardContainer.value?.focus()
      }, 100)
    }
  },
  { immediate: true },
)

const triggerFileInput = () => {
  if (!isLocked.value) {
    fileInput.value?.click()
  }
}

const processImageFile = (file) => {
  if (!file) return

  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    idCardImage.value = e.target?.result
    // Auto-lock after image is loaded
    autoLockAfterUpload()
  }
  reader.readAsDataURL(file)
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  processImageFile(file)
}

const handlePaste = (event) => {
  if (isLocked.value) return

  event.preventDefault()

  const items = event.clipboardData?.items
  if (!items) return

  for (let item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      processImageFile(file)
      break
    }
  }
}

const handleKeydown = (event) => {
  // Handle Ctrl+V or Cmd+V
  if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
    event.preventDefault()
    // Trigger file input or handle paste
    navigator.clipboard
      .read()
      .then((items) => {
        for (let item of items) {
          if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
            item
              .getType('image/png')
              .then((blob) => {
                processImageFile(blob)
              })
              .catch(() => {
                item.getType('image/jpeg').then((blob) => {
                  processImageFile(blob)
                })
              })
            break
          }
        }
      })
      .catch(() => {
        // Fallback: trigger file input
        triggerFileInput()
      })
  }
}

const handleDrop = (event) => {
  if (isLocked.value) return

  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processImageFile(files[0])
  }
}

const autoLockAfterUpload = () => {
  // Show lock immediately without processing delay
  isLocked.value = true

  // Emit the submission event for logging purposes only
  emit('submit', {
    ...formData.value,
    idCardImage: idCardImage.value,
  })
}

const closeModal = () => {
  emit('close')
  resetForm()
}

const stopLoading = () => {
  if (isProcessing.value) {
    isProcessing.value = false
  }
}

const resetForm = () => {
  formData.value = {
    name: '',
    orderId: '',
    phoneNumber: '',
  }
  idCardImage.value = null
  isDragging.value = false
  isLocked.value = false
  isProcessing.value = false
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped></style>
