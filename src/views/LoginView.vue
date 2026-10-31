<template>
  <div class="auth-container">
    <h2>Einloggen</h2>

    <input v-model="email" type="email" placeholder="E-Mail-Adresse" />
    <input v-model="password" type="password" placeholder="Passwort" />

    <div class="buttons">
      <button @click="login" :disabled="isLoggingIn">
        {{ isLoggingIn ? 'Bitte warten...' : 'Einloggen' }}
      </button>
    </div>

    <div>
      <p>Du hast noch kein Konto?</p>
      <p>Klicke <RouterLink to="/registrieren">hier</RouterLink> um ein Konto zu erstellen.</p>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const isLoggingIn = ref(false)

const login = async () => {
  // Verhindert mehrfaches Klicken, solange ein Login-Versuch läuft
  if (isLoggingIn.value) return

  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Bitte E-Mail und Passwort eingeben.'
    return
  }

  isLoggingIn.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    successMessage.value = 'Erfolgreich eingeloggt!'
    router.push('/profil')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoggingIn.value = false
  }
}
</script>
