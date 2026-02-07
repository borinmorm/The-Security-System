<template>
  <div class="p-8 bg-gray-50 min-h-full">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Customer PIN Verification</h1>
      <p class="text-gray-600 text-sm mt-1">
        Select a customer to verify PIN code for fund withdrawal
      </p>
    </div>

    <!-- Search and Filter -->
    <div class="mb-6">
      <div class="flex gap-4">
        <input v-model="searchQuery" type="text" placeholder="Search customer by name or account..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>

    <!-- Customer List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">Available Customers</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer ID</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Credit Score</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in filteredCustomers" :key="customer.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition">
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">#{{ customer.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ customer.name }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ customer.phone }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ customer.email }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="`px-3 py-1 rounded-full text-xs font-semibold ${getCreditClass(customer.creditScore)}`">
                  {{ customer.creditScore }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm">
                <button @click="selectCustomer(customer)"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                  Verify PIN
                </button>
              </td>
            </tr>
            <tr v-if="filteredCustomers.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">No customers found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PIN Verification Modal -->
    <PinVerificationModal :isOpen="showPinModal" :customer="selectedCustomer" :warningMessage="warningMessage"
      @close="closePinModal" @submit="handlePinSubmit" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLoanStore } from '../stores/loanStore'
import PinVerificationModal from '../components/PinVerificationModal.vue'

const loanStore = useLoanStore()
const showPinModal = ref(false)
const selectedCustomer = ref(null)
const searchQuery = ref('')
const warningMessage = ref("INVALID PAYMENT COULDN'T VERIFY REQUEST PIN CODE!")

const filteredCustomers = computed(() => {
  if (!searchQuery.value) {
    return loanStore.borrowers
  }

  const query = searchQuery.value.toLowerCase()
  return loanStore.borrowers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query),
  )
})

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  showPinModal.value = true
}

const closePinModal = () => {
  showPinModal.value = false
  selectedCustomer.value = null
}

const handlePinSubmit = (data) => {
  console.log('PIN Verification submitted for customer:', selectedCustomer.value)
  console.log('Submission data:', data)

  // Show success message or perform action
  alert(`PIN verified successfully for ${selectedCustomer.value.name}!`)
  closePinModal()
}

const getCreditClass = (score) => {
  if (score >= 750) return 'bg-green-100 text-green-700'
  if (score >= 650) return 'bg-blue-100 text-blue-700'
  return 'bg-red-100 text-red-700'
}
</script>

<style scoped></style>
