<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div
      ref="modalRef"
      class="bg-white rounded-lg shadow-2xl overflow-hidden resize-handle"
      :style="{
        position: 'fixed',
        left: modalPosition.x + 'px',
        top: modalPosition.y + 'px',
        width: modalSize.width + 'px',
        height: modalSize.height + 'px',
        maxHeight: '90vh',
      }"
    >
      <!-- Resize handles -->
      <div
        class="absolute top-0 left-0 w-2 h-full cursor-ew-resize"
        @mousedown="startResize($event, 'left')"
      ></div>
      <div
        class="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
        @mousedown="startResize($event, 'right')"
      ></div>
      <div
        class="absolute top-0 left-0 w-full h-2 cursor-ns-resize"
        @mousedown="startResize($event, 'top')"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize"
        @mousedown="startResize($event, 'bottom')"
      ></div>
      <div
        class="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize"
        @mousedown="startResize($event, 'top-left')"
      ></div>
      <div
        class="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize"
        @mousedown="startResize($event, 'top-right')"
      ></div>
      <div
        class="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize"
        @mousedown="startResize($event, 'bottom-left')"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
        @mousedown="startResize($event, 'bottom-right')"
      ></div>

      <!-- Header -->
      <div
        class="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 px-6 py-4 flex items-center justify-between cursor-move"
        @mousedown="startDrag"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span class="text-slate-700 font-bold text-xl">T</span>
          </div>
          <h2 class="text-xl font-bold text-white">SECURITY SYSTEM CONFIRM</h2>
        </div>
        <button
          @click="$emit('close')"
          class="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto" :style="{ maxHeight: 'calc(100% - 80px)' }">
        <!-- Warning Message -->
        <div class="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-2 text-red-600">
            <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              v-model="formData.warningMessage"
              type="text"
              class="flex-1 font-bold text-lg bg-transparent border-none outline-none text-red-600 placeholder-red-400"
              placeholder="NEED RECHARGE FOR REQUEST CHANGE BANK ACCOUNT"
            />
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Phone Number -->
          <div class="flex items-center gap-4">
            <label class="w-48 text-gray-600 font-semibold text-lg bg-gray-100 px-4 py-3 rounded">
              PHONE NUMBER
            </label>
            <input
              v-model="formData.phoneNumber"
              type="tel"
              placeholder="09505777764"
              class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-500 text-lg"
              required
            />
          </div>

          <!-- Account Name -->
          <div class="flex items-center gap-4">
            <label class="w-48 text-gray-600 font-semibold text-lg bg-gray-100 px-4 py-3 rounded">
              ACCOUNT NAME
            </label>
            <input
              v-model="formData.accountName"
              type="text"
              :placeholder="customer?.name || 'Kembert Nagaret'"
              class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-500 text-lg"
              required
            />
          </div>

          <!-- Deposit Amount -->
          <div class="flex items-center justify-between mb-4">
            <label class="font-bold text-gray-700 text-lg">DEPOSIT AMOUNT</label>
            <div class="flex gap-2 flex-1 ml-4">
              <input
                :value="depositAmountDisplay"
                type="text"
                placeholder="Enter amount"
                @input="updateDepositAmount"
                @keydown.backspace="handleBackspace"
                class="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-slate-500 text-lg"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <button
              type="submit"
              class="bg-slate-700 hover:bg-slate-800 text-white px-12 py-3 rounded-lg font-semibold text-lg transition-colors shadow-lg"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  customer: Object,
})

const emit = defineEmits(['close', 'submit'])

const modalRef = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const resizeDirection = ref('')
const dragStart = ref({ x: 0, y: 0 })
const modalPosition = ref({ x: 0, y: 0 })
const modalSize = ref({ width: 672, height: 500 })
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })

const formData = ref({
  phoneNumber: '',
  accountName: '',
  depositAmount: 0,
  warningMessage: 'NEED RECHARGE FOR REQUEST CHANGE BANK ACCOUNT',
})

const depositAmountDisplay = ref('')

// Center modal on open
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      centerModal()
      if (props.customer) {
        formData.value.phoneNumber = props.customer.phone || ''
        formData.value.accountName = props.customer.name || ''
        formData.value.depositAmount = 0
        depositAmountDisplay.value = ''
      }
    }
  },
  { immediate: true },
)

const centerModal = () => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const x = (windowWidth - modalSize.value.width) / 2
  const y = (windowHeight - modalSize.value.height) / 2

  modalPosition.value = { x, y }
}

const formatAmount = (value) => {
  if (!value) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const updateDepositAmount = (event) => {
  const inputValue = event.target.value
  const value = inputValue.replace(/\D/g, '')
  formData.value.depositAmount = value ? parseInt(value) : 0
  if (value) {
    const formatted = parseInt(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    depositAmountDisplay.value = `${formatted} PHP`
  } else {
    depositAmountDisplay.value = ''
  }
}

const handleBackspace = (event) => {
  const currentValue = depositAmountDisplay.value.replace(/\D/g, '')
  if (currentValue) {
    const newValue = currentValue.slice(0, -1)
    formData.value.depositAmount = newValue ? parseInt(newValue) : 0
    if (newValue) {
      const formatted = parseInt(newValue)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      depositAmountDisplay.value = `${formatted} PHP`
    } else {
      depositAmountDisplay.value = ''
    }
  }
}

const startDrag = (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - modalPosition.value.x,
    y: e.clientY - modalPosition.value.y,
  }
}

const onDrag = (e) => {
  if (!isDragging.value) return
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  let newX = e.clientX - dragStart.value.x
  let newY = e.clientY - dragStart.value.y

  // Constrain to viewport
  newX = Math.max(0, Math.min(newX, windowWidth - modalSize.value.width))
  newY = Math.max(0, Math.min(newY, windowHeight - modalSize.value.height))

  modalPosition.value = {
    x: newX,
    y: newY,
  }
}

const stopDrag = () => {
  isDragging.value = false
}

const handleEscapeKey = (event) => {
  if (event.key === 'Escape') {
    emit('close')
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

  const minWidth = 400
  const minHeight = 300
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

watch(
  () => props.customer,
  (newCustomer) => {
    if (newCustomer) {
      formData.value.phoneNumber = newCustomer.phone || ''
      formData.value.accountName = newCustomer.name || ''
      formData.value.depositAmount = ''
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>

<style scoped>
.resize-handle {
  user-select: none;
}
</style>
