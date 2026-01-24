<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Loans</h1>
      <button
        @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Add Loan
      </button>
    </div>

    <div v-if="showAddForm" class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-2xl font-bold mb-4">New Loan</h2>
      <form @submit.prevent="addLoan" class="space-y-4">
        <input
          v-model="newLoan.borrower"
          type="text"
          placeholder="Borrower Name"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model.number="newLoan.amount"
          type="number"
          placeholder="Loan Amount"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model.number="newLoan.interestRate"
          type="number"
          step="0.1"
          placeholder="Interest Rate (%)"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <select v-model="newLoan.status" class="w-full px-4 py-2 border rounded">
          <option>Active</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
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

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-6 py-3 text-left font-semibold">Loan ID</th>
            <th class="px-6 py-3 text-left font-semibold">Borrower</th>
            <th class="px-6 py-3 text-left font-semibold">Amount</th>
            <th class="px-6 py-3 text-left font-semibold">Interest Rate</th>
            <th class="px-6 py-3 text-left font-semibold">Status</th>
            <th class="px-6 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loan in loans" :key="loan.id" class="border-t hover:bg-gray-50">
            <td class="px-6 py-3">#{{ loan.id }}</td>
            <td class="px-6 py-3">{{ loan.borrower }}</td>
            <td class="px-6 py-3">${{ loan.amount }}</td>
            <td class="px-6 py-3">{{ loan.interestRate }}%</td>
            <td class="px-6 py-3">
              <span
                :class="`px-3 py-1 rounded text-white text-sm font-medium ${getStatusClass(loan.status)}`"
              >
                {{ loan.status }}
              </span>
            </td>
            <td class="px-6 py-3">
              <button
                @click="deleteLoan(loan.id)"
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useLoanStore } from '../stores/loanStore'

const loanStore = useLoanStore()
const showAddForm = ref(false)
const newLoan = ref({
  borrower: '',
  amount: 0,
  interestRate: 5,
  status: 'Pending',
})

const loans = computed(() => loanStore.loans)

const addLoan = () => {
  loanStore.addLoan(newLoan.value)
  newLoan.value = { borrower: '', amount: 0, interestRate: 5, status: 'Pending' }
  showAddForm.value = false
}

const deleteLoan = (id) => {
  loanStore.deleteLoan(id)
}

const getStatusClass = (status) => {
  const classes = {
    Active: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Completed: 'bg-blue-500',
  }
  return classes[status] || 'bg-gray-500'
}
</script>

<style scoped></style>
