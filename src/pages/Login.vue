<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative"
    style="background-image: url('/src/assets/wallpaper.jpg')"
  >
    <!-- Enhanced Gradient Overlay -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-800/85 via-slate-700/80 to-slate-900/90"
    ></div>

    <!-- Additional Pattern Overlay -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(circle, white 1px, transparent 1px);
          background-size: 50px 50px;
        "
      ></div>
    </div>

    <!-- Login Form -->
    <div class="relative z-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
      <!-- Logo Section -->
      <div class="flex justify-center mb-6">
        <div class="flex items-center gap-3">
          <img src="@/assets/logo_1.png" alt="Logo 1" class="h-12 object-contain" />
          <img src="@/assets/logo_2.png" alt="Logo 2" class="h-12 object-contain" />
        </div>
      </div>

      <!-- Title -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Security System</h1>
        <p class="text-gray-600">Secure Lending Platform</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Username -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Username</label>
          <input
            v-model="formData.username"
            type="text"
            placeholder="Enter your username"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
            required
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-transparent"
            required
          />
        </div>

        <!-- Login Button -->
        <button
          type="submit"
          class="w-full bg-gradient-to-r from-slate-700 to-slate-800 text-white py-3 rounded-lg font-semibold hover:from-slate-800 hover:to-slate-900 transition-all shadow-lg"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  username: '',
  password: '',
  rememberMe: false,
})

const handleLogin = () => {
  // Static login - just navigate to borrowers
  router.push('/borrowers')
}
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
