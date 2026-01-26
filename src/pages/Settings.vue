<template>
  <div class="p-8">
    <h1 class="text-4xl font-bold mb-8 text-gray-900">Settings</h1>

    <!-- Color Theme Section -->
    <div class="bg-white p-6 rounded-lg shadow max-w-2xl mb-6">
      <h2 class="text-2xl font-bold mb-6">Color Theme</h2>

      <div class="space-y-4">
        <div>
          <label class="block text-lg font-semibold mb-4">Select Color Theme</label>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="theme in availableThemes"
              :key="theme.id"
              @click="selectedTheme = theme.id"
              class="cursor-pointer group"
            >
              <div
                class="p-4 rounded-lg border-2 transition-all"
                :class="[
                  selectedTheme === theme.id
                    ? 'border-blue-600 shadow-lg'
                    : 'border-gray-200 hover:border-gray-400',
                ]"
              >
                <!-- Color preview -->
                <div class="flex gap-2 mb-3">
                  <div
                    v-for="color in theme.colors"
                    :key="color"
                    class="w-6 h-6 rounded-full"
                    :style="{ backgroundColor: color }"
                  ></div>
                </div>
                <p class="text-sm font-semibold text-gray-700">{{ theme.name }}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="applyTheme"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
        >
          Apply Theme
        </button>

        <div v-if="themeMessage" class="p-4 bg-blue-100 text-blue-700 rounded">
          {{ themeMessage }}
        </div>
      </div>
    </div>

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
import { ref, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { currentTheme, applyThemeToApp } = useTheme()

const settings = ref({
  minCreditScore: 650,
  maxLoanAmount: 100000,
  standardInterestRate: 5.5,
  systemName: 'LendSecure',
})

const saveMessage = ref('')
const themeMessage = ref('')

const availableThemes = [
  {
    id: 'blue',
    name: 'Blue',
    colors: ['#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd'],
  },
  {
    id: 'purple',
    name: 'Purple',
    colors: ['#a855f7', '#9333ea', '#d8b4fe', '#f5d0fe'],
  },
  {
    id: 'cyan',
    name: 'Cyber Cyan',
    colors: ['#06b6d4', '#0891b2', '#22d3ee', '#06ecff'],
  },
  {
    id: 'teal',
    name: 'Teal',
    colors: ['#14b8a6', '#0d9488', '#5eead4', '#99f6e4'],
  },
  {
    id: 'emerald',
    name: 'Emerald',
    colors: ['#10b981', '#059669', '#6ee7b7', '#a7f3d0'],
  },
  {
    id: 'rose',
    name: 'Rose',
    colors: ['#f43f5e', '#e11d48', '#fb7185', '#fda4af'],
  },
  {
    id: 'amber',
    name: 'Amber',
    colors: ['#f59e0b', '#d97706', '#fcd34d', '#fde68a'],
  },
  {
    id: 'slate',
    name: 'Dark',
    colors: ['#64748b', '#475569', '#cbd5e1', '#e2e8f0'],
  },
]

const selectedTheme = ref(currentTheme.value || 'blue')

const applyTheme = () => {
  applyThemeToApp(selectedTheme.value)
  themeMessage.value = `Theme changed to ${availableThemes.find((t) => t.id === selectedTheme.value)?.name}!`
  setTimeout(() => {
    themeMessage.value = ''
  }, 3000)
}

const saveSettings = () => {
  localStorage.setItem('loanSystemSettings', JSON.stringify(settings.value))
  saveMessage.value = 'Settings saved successfully!'
  setTimeout(() => {
    saveMessage.value = ''
  }, 3000)
}

onMounted(() => {
  const saved = localStorage.getItem('loanSystemSettings')
  if (saved) {
    settings.value = JSON.parse(saved)
  }
})
</script>

<style scoped></style>
