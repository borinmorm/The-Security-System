<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-8 text-gray-900">Reports</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">Loan Status Distribution</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Active Loans</span>
            <span class="font-bold">{{ loansByStatus.Active }}</span>
          </div>
          <div class="flex justify-between">
            <span>Pending Loans</span>
            <span class="font-bold">{{ loansByStatus.Pending }}</span>
          </div>
          <div class="flex justify-between">
            <span>Completed Loans</span>
            <span class="font-bold">{{ loansByStatus.Completed }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">Application Status</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Pending</span>
            <span class="font-bold">{{ appsByStatus.Pending }}</span>
          </div>
          <div class="flex justify-between">
            <span>Approved</span>
            <span class="font-bold">{{ appsByStatus.Approved }}</span>
          </div>
          <div class="flex justify-between">
            <span>Rejected</span>
            <span class="font-bold">{{ appsByStatus.Rejected }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">Financial Summary</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Total Loaned</span>
            <span class="font-bold text-green-600">${{ totalLoaned }}</span>
          </div>
          <div class="flex justify-between">
            <span>Avg Interest Rate</span>
            <span class="font-bold">{{ avgInterestRate }}%</span>
          </div>
          <div class="flex justify-between">
            <span>Avg Loan Amount</span>
            <span class="font-bold">${{ avgLoanAmount }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-2xl font-bold mb-4">Borrower Statistics</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>Total Borrowers</span>
            <span class="font-bold">{{ totalBorrowers }}</span>
          </div>
          <div class="flex justify-between">
            <span>Avg Credit Score</span>
            <span class="font-bold">{{ avgCreditScore }}</span>
          </div>
          <div class="flex justify-between">
            <span>Good Credit (750+)</span>
            <span class="font-bold text-green-600">{{ goodCreditCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useLoanStore } from '../stores/loanStore'

const loanStore = useLoanStore()

const loansByStatus = computed(() => ({
  Active: loanStore.loans.filter((l) => l.status === 'Active').length,
  Pending: loanStore.loans.filter((l) => l.status === 'Pending').length,
  Completed: loanStore.loans.filter((l) => l.status === 'Completed').length,
}))

const appsByStatus = computed(() => ({
  Pending: loanStore.applications.filter((a) => a.status === 'Pending').length,
  Approved: loanStore.applications.filter((a) => a.status === 'Approved').length,
  Rejected: loanStore.applications.filter((a) => a.status === 'Rejected').length,
}))

const totalLoaned = computed(() => loanStore.loans.reduce((sum, l) => sum + l.amount, 0))

const avgInterestRate = computed(() => {
  if (loanStore.loans.length === 0) return 0
  const avg = loanStore.loans.reduce((sum, l) => sum + l.interestRate, 0) / loanStore.loans.length
  return avg.toFixed(2)
})

const avgLoanAmount = computed(() => {
  if (loanStore.loans.length === 0) return 0
  return Math.round(totalLoaned.value / loanStore.loans.length)
})

const totalBorrowers = computed(() => loanStore.borrowers.length)

const avgCreditScore = computed(() => {
  if (loanStore.borrowers.length === 0) return 0
  const avg =
    loanStore.borrowers.reduce((sum, b) => sum + b.creditScore, 0) / loanStore.borrowers.length
  return Math.round(avg)
})

const goodCreditCount = computed(
  () => loanStore.borrowers.filter((b) => b.creditScore >= 750).length,
)
</script>

<style scoped></style>
