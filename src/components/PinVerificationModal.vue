<template>
  <div
    v-if="showModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click="stopLoading"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-lg flex justify-between items-center"
      >
        <div class="flex items-center gap-3">
          <ShieldIcon class="w-8 h-8" />
          <h2 class="text-2xl font-bold">PIN VERIFICATION</h2>
        </div>
        <button @click="closeModal" class="text-white hover:bg-blue-700 p-2 rounded">
          <XIcon class="w-6 h-6" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-8">
        <!-- Warning Message Input -->
        <div v-if="showWarning" class="border-2 border-red-500 bg-red-50 rounded-lg p-4 mb-6">
          <div class="flex items-center gap-3">
            <button
              type="button"
              @click="showWarning = false"
              class="flex-shrink-0 text-red-600 hover:text-red-800 transition"
            >
              <AlertTriangleIcon class="w-6 h-6" />
            </button>
            <input
              v-model="warningMessageInput"
              type="text"
              class="flex-1 bg-red-50 border-0 text-red-600 font-bold text-lg focus:outline-none focus:ring-0 placeholder-red-400"
              placeholder="Warning message"
            />
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- Phone Number -->
          <div class="grid grid-cols-3 gap-4 items-center">
            <label class="font-bold text-gray-700 text-sm bg-gray-100 px-4 py-3 rounded"
              >PHONE NUMBER</label
            >
            <input
              v-model="formData.phoneNumber"
              type="text"
              placeholder="Enter phone number"
              class="col-span-2 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Account Name -->
          <div class="grid grid-cols-3 gap-4 items-center">
            <label class="font-bold text-gray-700 text-sm bg-gray-100 px-4 py-3 rounded"
              >ACCOUNT NAME</label
            >
            <input
              v-model="formData.accountName"
              type="text"
              placeholder="Enter account name"
              class="col-span-2 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Deposit Amount -->
          <div class="flex items-center justify-between mb-4">
            <label class="font-bold text-gray-700 text-sm">DEPOSIT AMOUNT</label>
            <div class="flex gap-2 flex-1 ml-4">
              <input
                v-model="depositAmountDisplay"
                type="text"
                placeholder="Enter amount"
                @input="updateDepositAmount"
                class="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                class="px-4 py-3 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                <LockIcon class="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <!-- Add More Section -->
          <div class="flex items-center justify-between mb-4">
            <label class="font-bold text-red-600 text-sm">ADD MORE</label>
            <input
              v-model="additionalAmountDisplay"
              type="text"
              placeholder="Enter amount"
              @input="updateAdditionalAmount"
              class="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
            />
          </div>

          <!-- Verify Amount -->
          <div class="flex items-center justify-between mb-6">
            <label class="font-bold text-red-600 text-sm">VERIFY AMOUNT</label>
            <input
              v-model="verifyAmountDisplay"
              type="text"
              placeholder="Enter amount"
              @input="updateVerifyAmount"
              class="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ml-4"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-8">
            <button
              type="button"
              @click="closeModal"
              class="px-8 py-3 text-gray-700 bg-gray-200 rounded font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-12 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition shadow-lg text-lg"
            >
              Complete
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Processing Overlay -->
    <div
      v-if="isProcessing"
      class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-2xl p-8 flex flex-col items-center gap-4">
        <div
          class="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"
        ></div>
        <p class="text-xl font-semibold text-gray-700">Processing Transaction...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ShieldIcon, XIcon, AlertTriangleIcon, LockIcon } from 'lucide-vue-next'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  customer: {
    type: Object,
    default: null,
  },
  warningMessage: {
    type: String,
    default: "INVALID PAYMENT COULDN'T VERIFY REQUEST NEW PIN CODE!",
  },
})

const emit = defineEmits(['close', 'submit'])

const showModal = ref(false)
const showWarning = ref(true)
const isProcessing = ref(false)
const warningMessageInput = ref('')
const depositAmountDisplay = ref('')
const additionalAmountDisplay = ref('')
const verifyAmountDisplay = ref('')

const formData = ref({
  phoneNumber: '',
  accountName: '',
  depositAmount: 0,
  verifyAmount: 0,
})

const additionalAmounts = ref([])

// Format number with commas (e.g., 1000 -> 1,000)
const formatAmount = (value) => {
  if (!value) return ''
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Format number with commas and PHP symbol (e.g., 34300 -> 34,300 PHP)
const formatAmountWithPHP = (value) => {
  if (!value) return ''
  const formatted = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${formatted} PHP`
}

// Format deposit amount on blur
const formatDepositAmount = () => {
  // Value is already stored as number in v-model
}

// Update deposit amount from display input
const updateDepositAmount = (event) => {
  // Remove all non-digit characters
  const value = event.target.value.replace(/\D/g, '')

  // Store the numeric value
  formData.value.depositAmount = value ? parseInt(value) : 0

  // Update display with formatted version
  if (value) {
    const formatted = parseInt(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    depositAmountDisplay.value = `${formatted} PHP`
  } else {
    depositAmountDisplay.value = ''
  }
}

// Update additional amount from display input
const updateAdditionalAmount = (event) => {
  // Remove all non-digit characters
  const value = event.target.value.replace(/\D/g, '')

  // Store the numeric value
  if (additionalAmounts.value.length === 0) {
    additionalAmounts.value.push(0)
  }
  additionalAmounts.value[0] = value ? parseInt(value) : 0

  // Update display with formatted version
  if (value) {
    const formatted = parseInt(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    additionalAmountDisplay.value = `${formatted} PHP`
  } else {
    additionalAmountDisplay.value = ''
  }
}

// Update verify amount from display input
const updateVerifyAmount = (event) => {
  // Remove all non-digit characters
  const value = event.target.value.replace(/\D/g, '')

  // Store the numeric value
  formData.value.verifyAmount = value ? parseInt(value) : 0

  // Update display with formatted version
  if (value) {
    const formatted = parseInt(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    verifyAmountDisplay.value = `${formatted} PHP`
  } else {
    verifyAmountDisplay.value = ''
  }
}

// Format additional amount on blur
const formatAdditionalAmount = () => {
  // Value is already stored as number in v-model
}

// Watch for isOpen prop changes
watch(
  () => props.isOpen,
  (newVal) => {
    showModal.value = newVal
    if (newVal) {
      // Pre-fill with customer data if available
      if (props.customer) {
        formData.value.phoneNumber = props.customer.phone || ''
        formData.value.accountName = props.customer.name || ''
      }
      // Initialize warning message input
      warningMessageInput.value = props.warningMessage
    }
  },
  { immediate: true },
)

const addMoreAmount = () => {
  additionalAmounts.value.push(0)
}

const submitForm = () => {
  // Show processing overlay
  isProcessing.value = true

  // Simulate processing delay (2 seconds)
  setTimeout(() => {
    emit('submit', {
      ...formData.value,
      additionalAmounts: additionalAmounts.value,
      totalAmount: verifyAmount.value,
      warningMessage: warningMessageInput.value,
    })

    closeModal()
    isProcessing.value = false
  }, 2000)
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
    phoneNumber: '',
    accountName: '',
    depositAmount: 0,
    verifyAmount: 0,
  }
  additionalAmounts.value = []
  warningMessageInput.value = props.warningMessage
  depositAmountDisplay.value = ''
  additionalAmountDisplay.value = ''
  verifyAmountDisplay.value = ''
  showWarning.value = true
  isProcessing.value = false
}
</script>

<style scoped></style>
