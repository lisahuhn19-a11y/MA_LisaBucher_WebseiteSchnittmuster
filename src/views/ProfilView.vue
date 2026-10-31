<script setup>
import { ref, computed, onMounted } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged, signOut, sendEmailVerification } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentUser = ref(null)
const isLoading = ref(true)
const isEmailVerified = ref(false)
const isSendingEmail = ref(false)
const emailMessage = ref('')

const firstName = computed(() => {
  if (!currentUser.value || !currentUser.value.displayName) return ''
  return currentUser.value.displayName.split(' ')[0]
})

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Neu laden, damit eine inzwischen bestätigte E-Mail erkannt wird
      await user.reload()
      isEmailVerified.value = user.emailVerified
    }
    currentUser.value = user
    isLoading.value = false
  })
})

const resendVerificationEmail = async () => {
  // Verhindert mehrfaches Klicken, solange die E-Mail gesendet wird
  if (isSendingEmail.value) return

  isSendingEmail.value = true
  emailMessage.value = ''
  try {
    auth.languageCode = 'de'
    await sendEmailVerification(auth.currentUser)
    emailMessage.value = 'Bestätigungs-E-Mail wurde gesendet. Schau auch im Spam-Ordner nach.'
  } catch (error) {
    if (error.code === 'auth/too-many-requests') {
      emailMessage.value = 'Zu viele Versuche. Bitte warte ein paar Minuten und versuche es dann nochmals.'
    } else {
      emailMessage.value = 'Fehler beim Senden der E-Mail.'
      console.error('Fehler beim Senden der Bestätigungs-E-Mail:', error)
    }
  } finally {
    isSendingEmail.value = false
  }
}

const checkVerification = async () => {
  await auth.currentUser.reload()
  isEmailVerified.value = auth.currentUser.emailVerified
  if (!isEmailVerified.value) {
    emailMessage.value = 'Deine E-Mail ist noch nicht bestätigt. Klicke zuerst auf den Link in der E-Mail.'
  }
}

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

      <div v-if="!isEmailVerified" class="verify-hint">
        <p><strong>Deine E-Mail-Adresse ist noch nicht bestätigt.</strong></p>
        <p>Wir haben dir eine E-Mail an {{ currentUser.email }} geschickt. Klicke auf den Link darin, um dein Konto zu bestätigen.</p>
        <div class="verify-buttons">
          <button @click="resendVerificationEmail" :disabled="isSendingEmail">
            {{ isSendingEmail ? 'Wird gesendet...' : 'E-Mail nochmals senden' }}
          </button>
          <button @click="checkVerification">Ich habe bestätigt</button>
        </div>
        <p v-if="emailMessage">{{ emailMessage }}</p>
      </div>
      <h2>Dein Konto</h2>
      <p>Hier findest du alle deine Masse und hochgeladenen Fotos</p>
      <button @click="logout">Ausloggen</button>
    </div>
  </div>
</template>
<style scoped>
.verify-hint {
  background-color: #fff8d6;
  border-left: 4px solid #ffda24;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.verify-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.verify-buttons button {
  width: auto;
  padding: 0 1rem;
}
</style>
