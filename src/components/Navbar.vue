<template>
  <nav
    class="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg h-16 flex-shrink-0"
  >
    <div class="h-full px-6 flex">
      <div class="flex justify-between items-center w-full">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white border-opacity-30 p-1"
          >
            <img src="@/assets/logo_3.png" alt="Logo" class="w-full h-full object-contain" />
          </div>
          <div>
            <span class="text-xl font-bold text-white">Security System</span>
            <p class="text-blue-100 text-xs">Secure Lending Platform</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-3">
            <!-- Avatar Image with Upload -->
            <div class="relative group">
              <img
                v-if="avatarPreview"
                :src="avatarPreview"
                alt="Profile Avatar"
                class="w-10 h-10 rounded-full object-cover border-2 border-white border-opacity-50 cursor-pointer hover:border-opacity-100 transition-all"
                @click="triggerFileUpload"
              />
              <div
                v-else
                class="w-10 h-10 rounded-full bg-white bg-opacity-20 border-2 border-white border-opacity-50 flex items-center justify-center cursor-pointer hover:bg-opacity-30 transition-all"
                @click="triggerFileUpload"
              >
                <UserIcon class="w-5 h-5 text-white" />
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />
              <!-- Hover Tooltip -->
              <div
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              >
                Click to upload avatar
              </div>
            </div>
            <input
              v-model="userName"
              type="text"
              :size="userName.length || 10"
              @blur="updateUserName"
              @keyup.enter="updateUserName"
              class="text-sm text-white bg-transparent focus:outline-none focus:bg-blue-500 focus:bg-opacity-30 focus:rounded px-2 py-1"
            />
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { BuildingIcon, UserIcon } from 'lucide-vue-next'
import { useLocalStorage } from '../composables/useLocalStorage'

const router = useRouter()
const { getItem, setItem } = useLocalStorage()
const userName = ref('Admin User')
const avatarPreview = ref(null)
const fileInput = ref(null)

onMounted(() => {
  // Load avatar from localStorage
  const savedAvatar = getItem('userAvatar')
  if (savedAvatar) {
    avatarPreview.value = savedAvatar
  }

  // Load username from localStorage
  const savedUserName = getItem('userName')
  if (savedUserName) {
    userName.value = savedUserName
  }
})

const triggerFileUpload = () => {
  fileInput.value.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64Image = e.target.result
      avatarPreview.value = base64Image
      // Save avatar to localStorage
      setItem('userAvatar', base64Image)
    }
    reader.readAsDataURL(file)
  }
}

const updateUserName = () => {
  // Save username to localStorage
  setItem('userName', userName.value)
}
</script>

<style scoped></style>
