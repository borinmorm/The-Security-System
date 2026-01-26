<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from './composables/useTheme'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
const isLoginPage = computed(() => route.path === '/login')

// Initialize theme on app load
const { initializeTheme } = useTheme()
onMounted(() => {
  initializeTheme()
})
</script>

<template>
  <div class="h-screen flex flex-col bg-white">
    <!-- Show layout only when not on login page -->
    <template v-if="!isLoginPage">
      <!-- Navbar -->
      <Navbar />

      <!-- Main Content Area -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Sidebar -->
        <Sidebar />

        <!-- Page Content -->
        <main class="flex-1 overflow-auto bg-gray-50">
          <div class="h-full flex flex-col">
            <router-view />
            <!-- <Footer /> -->
          </div>
        </main>
      </div>
    </template>

    <!-- Login page without layout -->
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style scoped></style>
