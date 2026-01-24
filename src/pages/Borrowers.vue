<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Borrowers</h1>
      <button
        @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Add Borrower
      </button>
    </div>

    <div v-if="showAddForm" class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-2xl font-bold mb-4">New Borrower</h2>
      <form @submit.prevent="addBorrower" class="space-y-4">
        <input
          v-model="newBorrower.name"
          type="text"
          placeholder="Full Name"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model="newBorrower.email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model="newBorrower.phone"
          type="tel"
          placeholder="Phone Number"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model.number="newBorrower.creditScore"
          type="number"
          placeholder="Credit Score (300-850)"
          min="300"
          max="850"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            @click="showAddForm = false"
            class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Search and Filter Bar -->
    <div class="bg-white rounded-lg shadow p-4 mb-8">
      <div class="flex flex-wrap gap-4 items-end">
        <!-- Search Input -->
        <div class="flex-1 min-w-64">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Search</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or phone..."
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Credit Score Filter -->
        <div class="w-48">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Credit Score</label>
          <select
            v-model="creditScoreFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Scores</option>
            <option value="excellent">Excellent (750+)</option>
            <option value="good">Good (650-749)</option>
            <option value="fair">Fair (550-649)</option>
            <option value="poor">Poor (&lt;550)</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div class="w-48">
          <label class="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="locked">Locked</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <button
            @click="resetFilters"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
          >
            Reset
          </button>
          <button
            @click="exportResults"
            class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
          >
            Export
          </button>
        </div>
      </div>
      <div class="mt-3 text-sm text-gray-600">Found {{ filteredBorrowers.length }} borrower(s)</div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">ID</th>
            <th class="px-6 py-3 text-left font-semibold">Name</th>
            <th class="px-6 py-3 text-left font-semibold">Email</th>
            <th class="px-6 py-3 text-left font-semibold">Phone</th>
            <th class="px-6 py-3 text-left font-semibold">Credit Score</th>
            <th class="px-6 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="borrower in filteredBorrowers"
            :key="borrower.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-6 py-3 font-semibold">#{{ borrower.id }}</td>
            <td class="px-6 py-3">
              <input
                :value="borrower.name"
                @blur="(e) => updateBorrower(borrower.id, { name: e.target.value })"
                @keyup.enter="(e) => updateBorrower(borrower.id, { name: e.target.value })"
                class="w-full px-2 py-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:rounded"
              />
            </td>
            <td class="px-6 py-3">
              <input
                :value="borrower.email"
                @blur="(e) => updateBorrower(borrower.id, { email: e.target.value })"
                @keyup.enter="(e) => updateBorrower(borrower.id, { email: e.target.value })"
                class="w-full px-2 py-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:rounded"
              />
            </td>
            <td class="px-6 py-3">
              <input
                :value="borrower.phone"
                @blur="(e) => updateBorrower(borrower.id, { phone: e.target.value })"
                @keyup.enter="(e) => updateBorrower(borrower.id, { phone: e.target.value })"
                class="w-full px-2 py-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:rounded"
              />
            </td>
            <td class="px-6 py-3">
              <input
                type="number"
                :value="borrower.creditScore"
                @blur="
                  (e) => updateBorrower(borrower.id, { creditScore: parseInt(e.target.value) })
                "
                @keyup.enter="
                  (e) => updateBorrower(borrower.id, { creditScore: parseInt(e.target.value) })
                "
                min="300"
                max="850"
                class="w-20 px-2 py-1 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:rounded"
                :class="`font-semibold ${getCreditClass(borrower.creditScore)}`"
              />
            </td>
            <td class="px-6 py-3 flex gap-2">
              <div class="relative">
                <button
                  @click="toggleDropdown(borrower.id)"
                  class="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  Actions ▼
                </button>
                <div
                  v-if="openDropdown === borrower.id"
                  class="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded shadow-lg z-10"
                  @click="closeDropdown"
                >
                  <button
                    @click="openLockModal(borrower)"
                    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <LockIcon class="w-4 h-4" />
                    Lock
                  </button>
                  <button
                    @click="openPinModal(borrower)"
                    class="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 flex items-center gap-2"
                  >
                    <ShieldIcon class="w-4 h-4" />
                    PIN Code
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Showing 1 to {{ filteredBorrowers.length }} of {{ filteredBorrowers.length }} entries
      </div>
      <div class="flex gap-2">
        <button
          class="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          disabled
        >
          Previous
        </button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">1</button>
        <button
          class="px-4 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
          disabled
        >
          Next
        </button>
      </div>
    </div>

    <!-- PIN Verification Modal -->
    <PinVerificationModal
      :isOpen="showPinModal"
      :customer="selectedBorrower"
      :warningMessage="warningMessage"
      @close="closePinModal"
      @submit="handlePinSubmit"
    />

    <!-- Lock Modal -->
    <LockModal
      :isOpen="showLockModal"
      :customer="selectedBorrower"
      @close="closeLockModal"
      @submit="handleLockSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLoanStore } from '../stores/loanStore'
import { LockIcon, ShieldIcon, TrashIcon } from 'lucide-vue-next'
import PinVerificationModal from '../components/PinVerificationModal.vue'
import LockModal from '../components/LockModal.vue'

const loanStore = useLoanStore()
const showAddForm = ref(false)
const showPinModal = ref(false)
const showLockModal = ref(false)
const selectedBorrower = ref(null)
const openDropdown = ref(null)
const warningMessage = ref("INVALID PAYMENT COULDN'T VERIFY REQUEST NEW PIN CODE!")
const newBorrower = ref({
  name: '',
  email: '',
  phone: '',
  creditScore: 650,
})

const borrowers = computed(() => loanStore.borrowers)

const addBorrower = () => {
  loanStore.addBorrower(newBorrower.value)
  newBorrower.value = { name: '', email: '', phone: '', creditScore: 650 }
  showAddForm.value = false
}

const deleteBorrower = (id) => {
  loanStore.deleteBorrower(id)
}

const updateBorrower = (id, updates) => {
  loanStore.updateBorrower(id, updates)
}

const getCreditClass = (score) => {
  if (score >= 750) return 'text-green-600'
  if (score >= 650) return 'text-blue-600'
  return 'text-black'
}

// Search and Filter Variables
const searchQuery = ref('')
const creditScoreFilter = ref('')
const statusFilter = ref('')

// Filtered Borrowers
const filteredBorrowers = computed(() => {
  return borrowers.value.filter((borrower) => {
    // Search filter
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch =
      !searchQuery.value ||
      borrower.name.toLowerCase().includes(searchLower) ||
      borrower.email.toLowerCase().includes(searchLower) ||
      borrower.phone.includes(searchQuery.value)

    // Credit score filter
    let matchesCreditScore = true
    if (creditScoreFilter.value) {
      const score = borrower.creditScore
      switch (creditScoreFilter.value) {
        case 'excellent':
          matchesCreditScore = score >= 750
          break
        case 'good':
          matchesCreditScore = score >= 650 && score < 750
          break
        case 'fair':
          matchesCreditScore = score >= 550 && score < 650
          break
        case 'poor':
          matchesCreditScore = score < 550
          break
      }
    }

    // Status filter
    let matchesStatus = true
    if (statusFilter.value) {
      const isLocked = borrower.isLocked || false
      if (statusFilter.value === 'active') {
        matchesStatus = !isLocked
      } else if (statusFilter.value === 'locked') {
        matchesStatus = isLocked
      }
    }

    return matchesSearch && matchesCreditScore && matchesStatus
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  creditScoreFilter.value = ''
  statusFilter.value = ''
}

const exportResults = () => {
  const csvContent = [
    ['ID', 'Name', 'Email', 'Phone', 'Credit Score'],
    ...filteredBorrowers.value.map((b) => [b.id, b.name, b.email, b.phone, b.creditScore]),
  ]
    .map((row) => row.join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `borrowers_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

const openPinModal = (borrower) => {
  selectedBorrower.value = borrower
  showPinModal.value = true
}

const closePinModal = () => {
  showPinModal.value = false
  selectedBorrower.value = null
}

const openLockModal = (borrower) => {
  selectedBorrower.value = borrower
  showLockModal.value = true
}

const closeLockModal = () => {
  showLockModal.value = false
  selectedBorrower.value = null
}

const handlePinSubmit = (data) => {
  console.log('PIN Verification submitted for borrower:', selectedBorrower.value)
  console.log('Submission data:', data)
  alert(`PIN verified successfully for ${selectedBorrower.value.name}!`)
  closePinModal()
}

const handleLockSubmit = (data) => {
  console.log('Lock form submitted for borrower:', selectedBorrower.value)
  console.log('Submission data:', data)
  // Don't close modal automatically - let user close it manually
}

const toggleDropdown = (borrowerId) => {
  openDropdown.value = openDropdown.value === borrowerId ? null : borrowerId
}

const closeDropdown = () => {
  openDropdown.value = null
}
</script>

<style scoped></style>
