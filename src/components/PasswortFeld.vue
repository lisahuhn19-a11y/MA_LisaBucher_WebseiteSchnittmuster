<!-- Passwortfeld mit Auge zum Ein- und Ausblenden des Passworts -->
<script setup>
import { ref } from 'vue'

// v-model von aussen (z. B. password in LoginView)
const password = defineModel()

defineProps({
  id: String,
  placeholder: String,
  autocomplete: { type: String, default: 'current-password' }
})

const isVisible = ref(false)
</script>

<template>
  <div class="password-wrapper">
    <input
      :id="id"
      v-model="password"
      :type="isVisible ? 'text' : 'password'"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      required
    />
    <button
      type="button"
      class="eye-button"
      @click="isVisible = !isVisible"
      :aria-label="isVisible ? 'Passwort verbergen' : 'Passwort anzeigen'"
      :title="isVisible ? 'Passwort verbergen' : 'Passwort anzeigen'"
    >
      <!-- Auge offen -->
      <svg v-if="!isVisible" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      <!-- Auge durchgestrichen -->
      <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.password-wrapper {
  position: relative;
  display: inline-block;
}

.password-wrapper input {
  padding-right: 2rem;
}

/* überschreibt den globalen gelben Button-Stil nur für das Auge */
.eye-button {
  position: absolute;
  right: 0.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: auto;
  height: auto;
  margin: 0;
  padding: 0.1rem;
  background: none;
  color: #313131;
}

.eye-button:hover {
  background: none;
  color: #3A0E60;
}
</style>
