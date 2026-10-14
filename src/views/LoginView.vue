<template>
  <div class="auth-container">
    <h2>Login / Registrierung</h2>
    
    <input v-model="email" type="email" placeholder="E-Mail-Adresse" />
    <input v-model="password" type="password" placeholder="Passwort" />
    
    <div class="buttons">
      <button @click="register">Registrieren</button>
      <button @click="login">Einloggen</button>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

// Registrieren
const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
    successMessage.value = 'Erfolgreich registriert!'
  } catch (error) {
    errorMessage.value = error.message
  }
}

// Einloggen
const login = async () => {
  errorMessage.value = ''
    successMessage.value = ''
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
    successMessage.value = 'Erfolgreich eingeloggt!'
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>