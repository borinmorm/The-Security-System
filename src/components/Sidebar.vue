<template>
  <aside
    class="w-64 border-r h-full flex-shrink-0 p-4 flex flex-col bg-white"
    :style="{
      borderRightColor: '#cbd5e1',
    }"
  >
    <div class="flex-1 overflow-y-auto space-y-1">
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :style="getLinkStyle('/dashboard')"
      >
        <LayoutDashboardIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Dashboard</span>
      </router-link>
      <router-link
        to="/loans"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :style="getLinkStyle('/loans')"
      >
        <DollarSignIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Loans</span>
      </router-link>
      <router-link
        to="/applications"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :style="getLinkStyle('/applications')"
      >
        <FileTextIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Applications</span>
      </router-link>
      <router-link
        to="/borrowers"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :style="getLinkStyle('/borrowers')"
      >
        <UsersIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Borrowers</span>
      </router-link>
      <!-- Reports Dropdown -->
      <div>
        <button
          @click="toggleDropdown('reports')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
          :style="getLinkStyle('/reports')"
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
            class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-opacity-20 transition-all duration-200 text-sm"
            :style="getDropdownItemStyle('/reports')"
          >
            <span
              class="w-1.5 h-1.5 rounded-full flex-shrink-0"
              :style="{ backgroundColor: 'var(--color-primary)' }"
            ></span>
            <span>All Reports</span>
          </router-link>
        </div>
      </div>
      <router-link
        to="/settings"
        class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200"
        :style="getLinkStyle('/settings')"
      >
        <SettingsIcon class="w-5 h-5 flex-shrink-0" />
        <span class="font-medium">Settings</span>
      </router-link>
    </div>
    <div class="pt-4" :style="{ borderTopColor: '#e2e8f0', borderTopWidth: '1px' }">
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-red-700 hover:bg-red-50"
      >
        <LogOutIcon class="w-5 h-5 flex-shrink-0" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
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
import { useTheme } from '../composables/useTheme'

const route = useRoute()
const router = useRouter()
const openDropdowns = ref({})
const { themeConfig, currentTheme, themeUpdateTrigger } = useTheme()

// Watch for theme updates
const themeKey = computed(() => themeUpdateTrigger.value)

const lightenColor = (color, percent) => {
  const rgb = parseInt(color.slice(1), 16)
  const r = Math.min(255, (rgb >> 16) + percent)
  const g = Math.min(255, ((rgb >> 8) & 0xff) + percent)
  const b = Math.min(255, (rgb & 0xff) + percent)
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

const getLinkStyle = (path) => {
  const isActive = route.path === path
  return {
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    color: isActive ? 'white' : `var(--color-primary)`,
    boxShadow: isActive ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
  }
}

const getDropdownItemStyle = (path) => {
  const isActive = route.path === path
  return {
    backgroundColor: isActive ? `var(--color-light)` : 'transparent',
    color: isActive ? `var(--color-primary)` : `var(--color-primary)`,
    fontWeight: isActive ? '600' : '400',
  }
}

const toggleDropdown = (name) => {
  openDropdowns.value[name] = !openDropdowns.value[name]
}

const handleLogout = () => {
  router.push('/login')
}
</script>

<style scoped></style>
