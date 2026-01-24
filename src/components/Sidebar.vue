<template>
  <aside
    class="w-64 bg-gradient-to-b from-blue-50 via-blue-50 to-blue-100 border-r border-blue-200 h-full flex-shrink-0 p-4 flex flex-col"
  >
    <div class="flex-1 overflow-y-auto space-y-1">
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-900 hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white shadow-md': isActive('/dashboard') }"
      >
        <LayoutDashboardIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Dashboard</span>
      </router-link>
      <router-link
        to="/loans"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-900 hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white shadow-md': isActive('/loans') }"
      >
        <DollarSignIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Loans</span>
      </router-link>
      <router-link
        to="/applications"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-900 hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white shadow-md': isActive('/applications') }"
      >
        <FileTextIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Applications</span>
      </router-link>
      <router-link
        to="/borrowers"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-900 hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white shadow-md': isActive('/borrowers') }"
      >
        <UsersIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Borrowers</span>
      </router-link>
      <!-- Reports Dropdown -->
      <div>
        <button
          @click="toggleDropdown('reports')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-900 hover:bg-blue-100 transition-all duration-200"
          :class="{ 'bg-blue-600 text-white shadow-md': isActive('/reports') }"
        >
          <TrendingUpIcon class="w-5 h-5 flex-shrink-0" />
          <span class="font-medium flex-1 text-left">Reports</span>
          <ChevronDownIcon
            class="w-4 h-4 flex-shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': openDropdowns.reports }"
          />
        </button>
        <!-- Dropdown Items -->
        <div v-show="openDropdowns.reports" class="ml-6 mt-1 space-y-1">
          <router-link
            to="/reports"
            class="flex items-center gap-3 px-4 py-2 rounded-lg text-blue-800 hover:bg-blue-50 transition-all duration-200 text-sm"
            :class="{ 'bg-blue-100 font-semibold': isActive('/reports') }"
          >
            <span class="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
            <span>All Reports</span>
          </router-link>
        </div>
      </div>
      <router-link
        to="/settings"
        class="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-900 hover:bg-blue-100 transition-all duration-200"
        :class="{ 'bg-blue-600 text-white shadow-md': isActive('/settings') }"
      >
        <SettingsIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Settings</span>
      </router-link>
    </div>
    <div class="pt-4 border-t border-blue-200">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
      >
        <LogOutIcon class="w-5 h-5 flex-shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  LayoutDashboardIcon,
  DollarSignIcon,
  FileTextIcon,
  UsersIcon,
  TrendingUpIcon,
  SettingsIcon,
  LogOutIcon,
  ChevronDownIcon,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const openDropdowns = ref({})

const isActive = (path) => {
  return route.path === path
}

const toggleDropdown = (name) => {
  openDropdowns.value[name] = !openDropdowns.value[name]
}

const handleLogout = () => {
  router.push('/login')
}
</script>

<style scoped></style>
