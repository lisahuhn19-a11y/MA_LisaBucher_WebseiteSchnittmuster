<template>
  <div>
    <!-- Nur Vorname -->
    <p v-if="user">Willkommen {{ firstName }}!</p>
    
    <!-- Oder kompletter Vor- und Nachname -->
    <!-- <p v-if="user">Willkommen {{ user.displayName }}!</p> -->

    <p v-else>Lade Benutzerdaten...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const user = ref(null)

// Vornamen aus dem vollen Namen extrahieren
const firstName = computed(() => {
  if (!user.value || !user.value.displayName) return ''
  return user.value.displayName.split(' ')[0]
})

onMounted(() => {
  // Überwacht den Authentifizierungsstatus
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser
  })
})
</script>