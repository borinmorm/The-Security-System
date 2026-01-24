<template>
  <div class="p-8 bg-gray-50 min-h-full">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 text-sm mt-1">Welcome back! Here's your financial overview.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Loans</p>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ totalLoans }}</div>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSignIcon class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Amount</p>
            <div class="text-3xl font-bold text-gray-900 mt-2">
              ${{ (totalAmount / 1000).toFixed(0) }}K
            </div>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUpIcon class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Pending Applications</p>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ pendingApplications }}</div>
          </div>
          <div class="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <ClockIcon class="w-6 h-6 text-amber-600" />
          </div>
        </div>
      </div>
      <div
        class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-600 text-sm font-medium">Total Borrowers</p>
            <div class="text-3xl font-bold text-gray-900 mt-2">{{ totalBorrowers }}</div>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <UsersIcon class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-bold text-gray-900">Recent Loans</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Loan ID</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Borrower</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="loan in recentLoans"
              :key="loan.id"
              class="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td class="px-6 py-4 text-sm font-medium text-gray-900">#{{ loan.id }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ loan.borrower }}</td>
              <td class="px-6 py-4 text-sm font-semibold text-gray-900">
                ${{ loan.amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  :class="`px-3 py-1 rounded-full text-white text-xs font-medium ${getStatusClass(loan.status)}`"
                >
                  {{ loan.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLoanStore } from '../stores/loanStore'
import { DollarSignIcon, TrendingUpIcon, ClockIcon, UsersIcon } from 'lucide-vue-next'

const loanStore = useLoanStore()

const recentLoans = computed(() => loanStore.loans.slice(0, 5))
const totalLoans = computed(() => loanStore.loans.length)
const totalAmount = computed(() => loanStore.loans.reduce((sum, l) => sum + l.amount, 0))
const pendingApplications = computed(
  () => loanStore.applications.filter((a) => a.status === 'Pending').length,
)
const totalBorrowers = computed(() => loanStore.borrowers.length)

const getStatusClass = (status) => {
  const classes = {
    Active: 'bg-green-500',
    Pending: 'bg-amber-500',
    Completed: 'bg-blue-500',
    Rejected: 'bg-red-500',
  }
  return classes[status] || 'bg-gray-500'
}
</script>

<style scoped></style>
