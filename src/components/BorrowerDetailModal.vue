<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      ref="modalRef"
      class="bg-white rounded-lg shadow-2xl overflow-hidden resize-handle flex flex-col"
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
        class="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 flex items-center justify-between cursor-move flex-shrink-0"
        @mousedown="startDrag"
      >
        <h2 class="text-2xl font-bold text-white">Server Error</h2>
        <button
          @click="$emit('close')"
          class="text-white hover:bg-white hover:bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Body -->
      <div class="p-8 overflow-y-auto flex-1 bg-white">
        <div class="space-y-6">
          <!-- Error Title -->
          <div class="text-left mb-8">
            <h3 class="text-3xl font-bold text-red-600 mb-2">500 - Internal server error.</h3>
            <p class="text-lg font-semibold text-gray-900">
              There is a problem with the resource you are looking for, and it cannot be displayed.
            </p>
          </div>

          <!-- Borrower Information -->
          <div class="border-l-4 border-red-600 pl-4 py-2">
            <p class="text-lg font-semibold text-gray-900">
              Sir/Madam :
              <input
                v-model="formData.name"
                type="text"
                @blur="$emit('submit', formData)"
                class="inline-block w-auto px-2 py-1 bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-red-600 text-gray-900 font-bold"
              />
              /
              <input
                v-model="formData.idNumber"
                type="text"
                @blur="$emit('submit', formData)"
                placeholder="ID Number"
                class="inline-block w-auto px-2 py-1 bg-transparent border-b-2 border-gray-400 focus:outline-none focus:border-red-600 text-gray-900 font-bold"
              />
            </p>
          </div>

          <!-- Descriptive Text -->
          <div class="space-y-4 text-sm text-gray-900 leading-relaxed">
            <p>
              This refers to the review of the credit for this process is the lowest(
              <input
                v-model.number="formData.creditScore"
                type="number"
                @blur="$emit('submit', formData)"
                class="inline-block px-1 py-0 bg-transparent border-b border-gray-400 focus:outline-none focus:border-red-600 text-gray-900 font-bold transition-all duration-150"
                :class="[creditScoreWidth, getCreditClass(formData.creditScore)]"
              />
              credit score ), which is made in accordance with the letter of the system dated.
            </p>

            <p>
              After considering the issues raised and the documents submitted, the findings are
              communicated and the final decision on the Dispute Assessment (FDDA) dated /
              <input
                v-model="formData.decisionDate"
                type="date"
                @blur="$emit('submit', formData)"
                class="date-input-no-icon inline-block px-2 py-0 bg-transparent border-b border-gray-400 focus:outline-none focus:border-red-600 text-gray-900 font-bold"
              />
              is finalized. Issued with a lack of credit, as shown below, including a legal increase
              where your credit score is low by (STD) Form 0605, to with:
            </p>
          </div>

          <!-- Table Section -->
          <div class="my-8">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th
                    class="border-b-2 border-gray-800 px-4 py-3 text-left text-sm font-bold text-gray-900"
                  >
                    Kind of Credit
                  </th>
                  <th
                    class="border-b-2 border-gray-800 px-4 py-3 text-left text-sm font-bold text-gray-900"
                  >
                    Total amount
                  </th>
                  <th
                    class="border-b-2 border-gray-800 px-4 py-3 text-left text-sm font-bold text-gray-900"
                  >
                    Bank Code/BCS.NO
                  </th>
                  <th
                    class="border-b-2 border-gray-800 px-4 py-3 text-left text-sm font-bold text-gray-900"
                  >
                    Date Paid
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="border-b border-gray-300 px-4 py-3">
                    <span class="text-gray-900 font-bold text-sm">Insufficient - credit</span>
                  </td>
                  <td class="border-b border-gray-300 px-4 py-3">
                    <input
                      :value="totalAmountFormatted"
                      type="text"
                      @input="updateTotalAmountFormat"
                      @blur="$emit('submit', formData)"
                      placeholder="₱0"
                      class="w-full px-2 py-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 font-bold text-sm"
                    />
                  </td>
                  <td class="border-b border-gray-300 px-4 py-3">
                    <input
                      v-model="formData.bankCode"
                      type="text"
                      @blur="$emit('submit', formData)"
                      placeholder="0000000000"
                      class="w-full px-2 py-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 font-bold text-sm"
                    />
                  </td>
                  <td class="border-b border-gray-300 px-4 py-3">
                    <input
                      v-model="formData.datePaid"
                      type="date"
                      @blur="$emit('submit', formData)"
                      class="date-input-no-icon w-full px-2 py-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 font-bold text-sm"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Additional Information -->
          <div class="space-y-2 text-sm text-gray-900">
            <p class="font-bold">• For top up the credit score:</p>
            <p class="font-bold">• Current credit scores is {{ formData.creditScore }} credit</p>
            <p class="font-bold">
              • {{ formData.creditScore }} credit scores will be ₱{{
                formatAmount(formData.totalAmount)
              }}
              pesos
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'

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
const modalSize = ref({ width: 1200, height: 600 })
const resizeStart = ref({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 })

const totalAmountDisplay = ref('')
const totalAmountFormatted = ref('')
const originalCreditScore = ref(0)

const formData = ref({
  name: '',
  idNumber: '',
  creditScore: 0,
  totalAmount: 0,
  kindOfCredit: '',
  bankCode: '',
  decisionDate: '',
  datePaid: '',
})

// Center modal on open
watch(
  () => props.isOpen,
  async (newVal) => {
    if (newVal) {
      await nextTick()
      centerModal()
      if (props.customer) {
        formData.value.name = props.customer.name || ''
        formData.value.idNumber = props.customer.idNumber || ''
        formData.value.creditScore = props.customer.creditScore || 0
        originalCreditScore.value = props.customer.creditScore || 0
        formData.value.totalAmount = props.customer.totalAmount || 0
        formData.value.kindOfCredit = props.customer.kindOfCredit || ''
        formData.value.bankCode = props.customer.bankCode || ''
        formData.value.decisionDate = props.customer.decisionDate || ''
        formData.value.datePaid = props.customer.datePaid || ''
        if (formData.value.totalAmount) {
          totalAmountDisplay.value = 'P ' + formatAmount(formData.value.totalAmount) + '.00'
        }
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

const getCreditClass = (score) => {
  if (score >= 750) return 'text-green-600'
  if (score >= 650) return 'text-blue-600'
  return 'text-black'
}

const creditScoreWidth = computed(() => {
  const score = formData.value.creditScore
  if (!score) return 'w-12'
  const length = score.toString().length
  if (length <= 2) return 'w-12'
  if (length === 3) return 'w-16'
  if (length === 4) return 'w-20'
  return 'w-24'
})

const creditIncreaseDisplay = computed(() => {
  const totalAmount = formData.value.totalAmount
  if (!totalAmount) return '0'
  const creditIncrease = Math.round((totalAmount * 500) / 65000)
  return creditIncrease.toString()
})

const pesosPerCreditUnit = computed(() => {
  return (65000 / 500).toFixed(0) // Should be 130 pesos per credit point
})

const formatAmount = (value) => {
  if (!value) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const updateTotalAmountFormat = (event) => {
  const inputValue = event.target.value
  // Remove all non-digit characters
  const value = inputValue.replace(/\D/g, '')

  formData.value.totalAmount = value ? parseInt(value) : 0

  if (value) {
    const numValue = parseInt(value)
    const formatted = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    totalAmountFormatted.value = `₱${formatted}`
  } else {
    totalAmountFormatted.value = ''
  }
}

const updateTotalAmount = (event) => {
  const inputValue = event.target.value
  // Remove all non-digit characters
  const value = inputValue.replace(/\D/g, '')

  formData.value.totalAmount = value ? parseInt(value) : 0

  if (value) {
    const numValue = parseInt(value)
    const formatted = numValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    totalAmountDisplay.value = `P ${formatted}.00`
  } else {
    totalAmountDisplay.value = ''
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

  modalPosition.value = {
    x: e.clientX - dragStart.value.x,
    y: e.clientY - dragStart.value.y,
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
</script>

<style scoped>
.resize-handle {
  user-select: none;
}

/* Remove date input icon/picker */
.date-input-no-icon::-webkit-calendar-picker-indicator {
  display: none;
}

.date-input-no-icon::-webkit-outer-spin-button,
.date-input-no-icon::-webkit-inner-spin-button {
  display: none;
  -webkit-appearance: none;
  margin: 0;
}
</style>
