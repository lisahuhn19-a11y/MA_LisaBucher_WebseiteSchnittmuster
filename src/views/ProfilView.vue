<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const isLoading = ref(true)

const firstName = computed(() => {
  if (!currentUser.value || !currentUser.value.displayName) return ''
  return currentUser.value.displayName.split(' ')[0]
})

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
    isLoading.value = false
  })
})

const logout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Fehler beim Abmelden:', error)
  }
}
</script>

<template>
  <div v-if="isLoading">
    <p>Seite ist am Laden...</p>
  </div>

  <div v-else-if="!currentUser">
    <p>Du bist noch nicht angemeldet. Klicke <RouterLink to="/login">hier</RouterLink> um dich anzumelden.</p>
  </div>

  <div v-else>
    <div>
      <h1>Willkommen {{ firstName }}</h1>
      <h2>Dein Konto</h2>
      <p>Hier findest du alle deine Masse und hochgeladenen Fotos</p>
      <button @click="logout">Ausloggen</button>
    </div>
  </div>
</template>