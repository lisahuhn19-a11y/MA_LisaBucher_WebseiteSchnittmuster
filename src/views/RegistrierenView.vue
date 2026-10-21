<template>
  <div class="auth-container">
    <h2>Registrierung</h2>

    <div class="input-group">
      <label for="firstName">Vorname *</label>
      <input id="firstName" v-model="firstName" type="text" required />
    </div>

    <div class="input-group">
      <label for="lastName">Nachname *</label>
      <input id="lastName" v-model="lastName" type="text" required />
    </div>

    <div class="input-group">
      <label for="email">E-Mail-Adresse *</label>
      <input id="email" v-model="email" type="text" required />
    </div>

    <div class="input-group">
      <label for="password">Passwort *</label>
      <input id="password" v-model="password" type="text" required />
    </div>

    <div class="buttons">
      <button @click="register">Registrieren</button>
    </div>

    <div>
      <p>Du hast bereits ein Konto erstellt?</p>
      <p>Melde dich <RouterLink to="/login">hier</RouterLink> an.</p>
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
  updateProfile 
} from 'firebase/auth'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const register = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validiere, dass alle Felder ausgefüllt sind
  if (!firstName.value.trim() || !lastName.value.trim() || !email.value.trim() || !password.value) {
    errorMessage.value = 'Bitte fülle alle Pflichtfelder aus!'
    return
  }

  try {
    // 1. User bei Firebase Auth erstellen
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    
    // 2. Anzeigenamen (Vor- und Nachname) im Firebase User-Profil speichern
    const fullName = `${firstName.value.trim()} ${lastName.value.trim()}`
    await updateProfile(userCredential.user, {
      displayName: fullName
    })

    successMessage.value = 'Erfolgreich registriert!'
    
    // Felder zurücksetzen
    firstName.value = ''
    lastName.value = ''
    email.value = ''
    password.value = ''
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>