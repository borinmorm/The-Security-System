<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-8 text-gray-900">Settings</h1>

    <div class="bg-white p-6 rounded-lg shadow max-w-2xl">
      <h2 class="text-2xl font-bold mb-6">System Settings</h2>

      <div class="space-y-6">
        <div class="border-b pb-6">
          <label class="block text-lg font-semibold mb-2">Minimum Credit Score</label>
          <input
            v-model.number="settings.minCreditScore"
            type="number"
            class="w-full px-4 py-2 border rounded"
            min="300"
            max="850"
          />
          <p class="text-sm text-gray-600 mt-2">Minimum credit score required for loan approval</p>
        </div>

        <div class="border-b pb-6">
          <label class="block text-lg font-semibold mb-2">Maximum Loan Amount</label>
          <input
            v-model.number="settings.maxLoanAmount"
            type="number"
            class="w-full px-4 py-2 border rounded"
          />
          <p class="text-sm text-gray-600 mt-2">Maximum amount that can be loaned</p>
        </div>

        <div class="border-b pb-6">
          <label class="block text-lg font-semibold mb-2">Standard Interest Rate (%)</label>
          <input
            v-model.number="settings.standardInterestRate"
            type="number"
            step="0.1"
            class="w-full px-4 py-2 border rounded"
          />
          <p class="text-sm text-gray-600 mt-2">Default interest rate for new loans</p>
        </div>

        <div class="pb-6">
          <label class="block text-lg font-semibold mb-2">System Name</label>
          <input
            v-model="settings.systemName"
            type="text"
            class="w-full px-4 py-2 border rounded"
          />
          <p class="text-sm text-gray-600 mt-2">Display name for the lending system</p>
        </div>

        <button
          @click="saveSettings"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
        >
          Save Settings
        </button>

        <div v-if="saveMessage" class="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {{ saveMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const settings = ref({
  minCreditScore: 650,
  maxLoanAmount: 100000,
  standardInterestRate: 5.5,
  systemName: 'LendSecure',
})

const saveMessage = ref('')

const saveSettings = () => {
  localStorage.setItem('loanSystemSettings', JSON.stringify(settings.value))
  saveMessage.value = 'Settings saved successfully!'
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}
</script>

<style scoped></style>
