<template>
  <div class="auth-container">
    <h2>Einloggen</h2>

    <input v-model="email" type="email" placeholder="E-Mail-Adresse" />
    <input v-model="password" type="password" placeholder="Passwort" />

    <div class="buttons">
      <button @click="login">Einloggen</button>
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

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const login = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Bitte E-Mail und Passwort eingeben.'
    return
  }

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    successMessage.value = 'Erfolgreich eingeloggt!'
    await login(auth)
    router.push('/profil')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>
