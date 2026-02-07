<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="stopLoading"
  >
    <div
      ref="modalRef"
      class="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-lg shadow-2xl resize-handle overflow-hidden flex flex-col"
      :style="{
        position: 'fixed',
        left: modalPosition.x + 'px',
        top: modalPosition.y + 'px',
        width: modalSize.width + 'px',
        height: modalSize.height + 'px',
        maxHeight: '90vh',
      }"
      @click.stop
    >
      <!-- Resize handles -->
      <div
        class="absolute top-0 left-0 w-2 h-full cursor-ew-resize z-10"
        @mousedown="startResize($event, 'left')"
      ></div>
      <div
        class="absolute top-0 right-0 w-2 h-full cursor-ew-resize z-10"
        @mousedown="startResize($event, 'right')"
      ></div>
      <div
        class="absolute top-0 left-0 w-full h-2 cursor-ns-resize z-10"
        @mousedown="startResize($event, 'top')"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize z-10"
        @mousedown="startResize($event, 'bottom')"
      ></div>
      <div
        class="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize z-10"
        @mousedown="startResize($event, 'top-left')"
      ></div>
      <div
        class="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize z-10"
        @mousedown="startResize($event, 'top-right')"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize z-10"
        @mousedown="startResize($event, 'bottom-left')"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10"
        @mousedown="startResize($event, 'bottom-right')"
      ></div>

      <!-- Header -->
      <div
        class="sticky top-0 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white p-8 flex justify-between items-center rounded-t-lg border-b-2 border-cyan-500 shadow-lg shadow-cyan-500/50 cursor-move"
        @mousedown="startDrag"
      >
        <div class="flex items-center gap-4">
          <img :src="dofLogo" alt="Logo 1" class="h-16 object-contain drop-shadow-lg" />
          <img src="@/assets/logo_2.png" alt="Logo 2" class="h-16 object-contain drop-shadow-lg" />
          <div class="flex items-center gap-3 border-l-2 border-cyan-500 pl-4">
            <div>
              <h2
                class="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              >
                Security System (IT) Department
              </h2>
              <p class="text-cyan-300 text-sm mt-1 font-mono">ACCOUNT LOCKDOWN & VERIFICATION</p>
            </div>
          </div>
        </div>
        <button
          @click="closeModal"
          class="text-white hover:bg-red-600 p-3 rounded-lg transition border border-red-500 hover:border-red-300 hover:shadow-lg hover:shadow-red-500/50"
        >
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div
        class="p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto flex-1"
      >
        <div class="grid grid-cols-5 gap-8 h-full">
          <!-- Left Side - Form -->
          <div class="col-span-2">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-bold text-cyan-400 mb-4 font-mono flex items-center gap-2">
                  <span class="text-red-500">●</span> ACCOUNT INFORMATION
                </h3>
                <div
                  class="space-y-4 bg-slate-800/50 p-6 rounded-lg border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                >
                  <!-- Name -->
                  <div class="space-y-2">
                    <label class="font-semibold text-cyan-300 text-sm block font-mono">NAME</label>
                    <input
                      v-model="formData.name"
                      type="text"
                      placeholder="Enter full name"
                      class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-slate-700 bg-slate-700/50 text-white border border-cyan-500/30 placeholder-cyan-900 font-mono"
                    />
                  </div>

                  <!-- Order ID -->
                  <div class="space-y-2">
                    <label class="font-semibold text-cyan-300 text-sm block font-mono"
                      >ORDER ID</label
                    >
                    <input
                      v-model="formData.orderId"
                      type="text"
                      placeholder="Enter order ID"
                      class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-slate-700 bg-slate-700/50 text-white border border-cyan-500/30 placeholder-cyan-900 font-mono"
                    />
                  </div>

                  <!-- Phone Number -->
                  <div class="space-y-2">
                    <label class="font-semibold text-cyan-300 text-sm block font-mono"
                      >PHONE NUMBER</label
                    >
                    <input
                      v-model="formData.phoneNumber"
                      type="text"
                      placeholder="Enter phone number"
                      class="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-slate-700 bg-slate-700/50 text-white border border-cyan-500/30 placeholder-cyan-900 font-mono"
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
                <h3 class="text-lg font-bold text-cyan-400 mb-4 font-mono flex items-center gap-2">
                  <span class="text-red-500">●</span> ID CARD VERIFICATION
                </h3>
                <div class="relative">
                  <!-- ID Card Container -->
                  <div
                    ref="idCardContainer"
                    class="relative w-full h-80 border-3 border-dashed border-cyan-500/60 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 cursor-pointer hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 overflow-hidden group focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    @click="!isLocked && triggerFileInput()"
                    @paste="handlePaste"
                    @dragover.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    @drop.prevent="handleDrop"
                    @keydown="handleKeydown"
                    :class="{
                      'border-cyan-400 shadow-2xl shadow-cyan-500/50 from-slate-700 to-slate-900':
                        isDragging,
                    }"
                    tabindex="0"
                  >
                    <!-- Scan lines effect for empty state -->
                    <div v-if="!idCardImage" class="absolute inset-0 opacity-10">
                      <div class="scanlines h-full"></div>
                    </div>

                    <img
                      v-if="idCardImage"
                      :src="idCardImage"
                      alt="ID Card"
                      class="w-full h-full object-cover"
                    />

                    <div v-if="!idCardImage" class="text-center pointer-events-none relative z-10">
                      <div
                        class="bg-cyan-500/20 border-2 border-cyan-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-cyan-500/50"
                      >
                        <UploadCloudIcon class="w-8 h-8 text-cyan-400" />
                      </div>
                      <p class="text-cyan-300 font-semibold text-sm mb-1 font-mono">
                        UPLOAD ID CARD
                      </p>
                      <p class="text-cyan-500 text-xs font-mono">Click | Paste | Drag</p>
                    </div>

                    <!-- Processing State Overlay -->
                    <div
                      v-if="isProcessing && idCardImage"
                      class="absolute inset-0 bg-gradient-to-t from-black/80 via-cyan-500/20 to-transparent rounded-xl flex items-center justify-center"
                    >
                      <div
                        class="text-center bg-slate-950/95 px-6 py-4 rounded-lg shadow-2xl border-2 border-cyan-500 shadow-cyan-500/50"
                      >
                        <div
                          class="w-12 h-12 border-3 border-cyan-900 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2"
                        ></div>
                        <p class="text-cyan-300 font-semibold text-sm font-mono">[ SCANNING... ]</p>
                      </div>
                    </div>

                    <!-- Lock Overlay - Cyber Enhanced Design -->
                    <div
                      v-if="isLocked"
                      class="absolute inset-0 bg-gradient-to-t from-black/90 via-red-900/30 to-black/50 rounded-xl flex items-center justify-center"
                    >
                      <!-- Glitch effect -->
                      <div class="absolute inset-0 opacity-5">
                        <div class="scanlines h-full"></div>
                      </div>

                      <div class="text-center relative z-10">
                        <!-- Red pulsing border -->
                        <div
                          class="absolute -inset-8 border-2 border-red-500 rounded-xl animate-pulse opacity-50"
                        ></div>

                        <div
                          class="mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-900 rounded-full p-4 w-24 h-24 flex items-center justify-center shadow-2xl shadow-red-600/80 animate-pulse border-2 border-red-400"
                        >
                          <LockIcon class="w-12 h-12 text-white drop-shadow-lg" />
                        </div>
                        <h3
                          class="text-white text-3xl font-bold mb-2 font-mono drop-shadow-lg tracking-widest"
                        >
                          ACCOUNT LOCKED
                        </h3>
                        <p class="text-red-300 text-sm font-mono">
                          [ SECURITY PROTOCOL ACTIVATED ]
                        </p>
                        <p class="text-red-400 text-xs font-mono mt-2">
                          Unauthorized access detected
                        </p>
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
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl shadow-2xl shadow-cyan-500/50 p-8 flex flex-col items-center gap-4 border-2 border-cyan-500"
      >
        <div
          class="w-16 h-16 border-4 border-cyan-900 border-t-cyan-400 rounded-full animate-spin"
        ></div>
        <p class="text-xl font-semibold text-cyan-300 font-mono">[ VERIFYING ACCOUNT... ]</p>
        <p class="text-xs text-cyan-500 font-mono">Processing security scan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import dofLogo from '@/assets/Department_of_Finance_(DOF).svg'
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

const modalRef = ref(null)
const isDraggingModal = ref(false)
const isResizing = ref(false)
const resizeDirection = ref('')
const dragStart = ref({ x: 0, y: 0 })
const modalPosition = ref({ x: 0, y: 0 })
const modalSize = ref({ width: 1280, height: 800 })
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })

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

// Center modal on open
const centerModal = () => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const x = (windowWidth - modalSize.value.width) / 2
  const y = (windowHeight - modalSize.value.height) / 2

  modalPosition.value = { x, y }
}

const startDrag = (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return
  isDraggingModal.value = true
  dragStart.value = {
    x: e.clientX - modalPosition.value.x,
    y: e.clientY - modalPosition.value.y,
  }
}

const onDrag = (e) => {
  if (!isDraggingModal.value) return

  modalPosition.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y,
  }
}

const stopDrag = () => {
  isDraggingModal.value = false
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

const startResize = (e, direction) => {
  e.preventDefault()
  e.stopPropagation()
  isResizing.value = true
  resizeDirection.value = direction
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    width: modalSize.value.width,
    height: modalSize.value.height,
    posX: modalPosition.value.x,
    posY: modalPosition.value.y,
  }
}

const onResize = (e) => {
  if (!isResizing.value) return

  const deltaX = e.clientX - resizeStart.value.x
  const deltaY = e.clientY - resizeStart.value.y

  const minWidth = 600
  const minHeight = 400
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  if (resizeDirection.value.includes('right')) {
    const newWidth = Math.max(minWidth, resizeStart.value.width + deltaX)
    modalSize.value.width = Math.min(newWidth, windowWidth - resizeStart.value.posX)
  }
  if (resizeDirection.value.includes('left')) {
    const newWidth = Math.max(minWidth, resizeStart.value.width - deltaX)
    if (newWidth > minWidth) {
      const newX = resizeStart.value.posX + deltaX
      if (newX >= 0) {
        modalSize.value.width = newWidth
        modalPosition.value.x = newX
      }
    }
  }
  if (resizeDirection.value.includes('bottom')) {
    const newHeight = Math.max(minHeight, resizeStart.value.height + deltaY)
    modalSize.value.height = Math.min(newHeight, windowHeight - resizeStart.value.posY)
  }
  if (resizeDirection.value.includes('top')) {
    const newHeight = Math.max(minHeight, resizeStart.value.height - deltaY)
    if (newHeight > minHeight) {
      const newY = resizeStart.value.posY + deltaY
      if (newY >= 0) {
        modalSize.value.height = newHeight
        modalPosition.value.y = newY
      }
    }
  }
}

const stopResize = () => {
  isResizing.value = false
  resizeDirection.value = ''
}

onMounted(() => {
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mousemove', onResize)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mousemove', onResize)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('keydown', handleEscapeKey)
})

// Watch for isOpen prop changes
watch(
  () => props.isOpen,
  async (newVal) => {
    showModal.value = newVal
    if (newVal) {
      await nextTick()
      await nextTick()
      setTimeout(() => {
        centerModal()
      }, 0)
      if (props.customer) {
        formData.value.name = props.customer.name || ''
        formData.value.phoneNumber = props.customer.phone || ''
      }
      // Focus the ID card container when modal opens
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

  const dragState = isDragging.value
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processImageFile(files[0])
  }
  // Restore drag state for modal dragging
  if (dragState) {
    isDragging.value = dragState
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

<style scoped>
.resize-handle {
  user-select: none;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(10px);
  }
}

.scanlines {
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 255, 255, 0.03),
    rgba(0, 255, 255, 0.03) 1px,
    transparent 1px,
    transparent 2px
  );
  animation: scanline 8s linear infinite;
}

/* Cyber glow effect */
:deep(.cyber-glow) {
  text-shadow:
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(0, 255, 255, 0.5);
}
</style>
