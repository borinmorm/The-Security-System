<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-4xl font-bold text-gray-900">Loan Applications</h1>
      <button
        @click="showAddForm = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + New Application
      </button>
    </div>

    <div v-if="showAddForm" class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-2xl font-bold mb-4">New Application</h2>
      <form @submit.prevent="addApplication" class="space-y-4">
        <input
          v-model="newApp.applicantName"
          type="text"
          placeholder="Applicant Name"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model="newApp.email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <input
          v-model.number="newApp.requestedAmount"
          type="number"
          placeholder="Requested Amount"
          class="w-full px-4 py-2 border rounded"
          required
        />
        <select v-model="newApp.status" class="w-full px-4 py-2 border rounded">
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
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
            <th class="px-6 py-3 text-left font-semibold">App ID</th>
            <th class="px-6 py-3 text-left font-semibold">Name</th>
            <th class="px-6 py-3 text-left font-semibold">Email</th>
            <th class="px-6 py-3 text-left font-semibold">Amount</th>
            <th class="px-6 py-3 text-left font-semibold">Status</th>
            <th class="px-6 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" class="border-t hover:bg-gray-50">
            <td class="px-6 py-3">#{{ app.id }}</td>
            <td class="px-6 py-3">{{ app.applicantName }}</td>
            <td class="px-6 py-3">{{ app.email }}</td>
            <td class="px-6 py-3">${{ app.requestedAmount }}</td>
            <td class="px-6 py-3">
              <span
                :class="`px-3 py-1 rounded text-white text-sm font-medium ${getStatusClass(app.status)}`"
              >
                {{ app.status }}
              </span>
            </td>
            <td class="px-6 py-3">
              <button
                @click="deleteApplication(app.id)"
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
const newApp = ref({
  applicantName: '',
  email: '',
  requestedAmount: 0,
  status: 'Pending',
})

const applications = computed(() => loanStore.applications)

const addApplication = () => {
  loanStore.addApplication(newApp.value)
  newApp.value = { applicantName: '', email: '', requestedAmount: 0, status: 'Pending' }
  showAddForm.value = false
}

const deleteApplication = (id) => {
  loanStore.deleteApplication(id)
}

const getStatusClass = (status) => {
  const classes = {
    Pending: 'bg-yellow-500',
    Approved: 'bg-green-500',
    Rejected: 'bg-red-500',
  }
  return classes[status] || 'bg-gray-500'
}
</script>

<style scoped></style>
