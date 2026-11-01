<!-- src/views/StartseiteView.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { auth } from '@/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import logo from '../assets/Logos/LogoMiauMass.svg'

const currentUser = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })
})
</script>

<template>
  <div>
    <div>
      <img :src="logo" alt="Logo" class="startseite-logo"/>
    </div>
    
    <h2>damit dein massgeschneidertes Kleidungsstück nur noch einen Katzensprung entfernt ist...</h2>
    
    <p>Nähe deine eigenen, massgeschneiderten Kleidungsstücke mithilfe meiner Webseite</p>
    <div class="heading">
      <h2>Wie funktioniert es?</h2>      
    </div>
    
    <p>1. <RouterLink to="/messen2">Erfasse deine Masse</RouterLink> -> 2. <RouterLink to="/schnittmuster">Suche dein Schnittmuster aus</RouterLink> -> 3. <RouterLink to="/langarmshirt">lade das PDF herunter und drucke es aus</RouterLink> -> 4. bereit zum nähen</p>

    <div v-if="!currentUser">
      <p>Registriere dich <RouterLink to="/registrieren">hier</RouterLink>, um deine Masse zu speichern.</p>
    </div>

    <h2>Häufig gestellte Fragen</h2>
    <details>
      <summary>Warum braucht es so viele Masse?</summary>
      <p>Damit es sich lohnt ein massgeschneidertes Kleidungsstück zu nähen, muss es auch genau passen 
        und darum braucht es all diese Masse. Falls du nur ein bestimmtes Kleidungsstück wie z.B. einen 
        Rock nähen willst, kannst du das oben anklicken und dann erscheinen nur die für dieses Kleidungsstück 
        relevanten Masse.</p>
    </details>
    <details>
      <summary>Warum MiauMass? Sind das Schnittmuster für Katzen?</summary>
      <p>Nein, es sind Damenschnittmuster. Der Name "MiauMass" entstand, weil meine Katze mehr Zeit im Nähzimmer verbringt als ich.</p>
    </details>

  </div>
</template>

<style>
.startseite-logo {
  width: 500px;
  height: auto;
  margin-left: 0px;
}

.logo {
  width: 0px;
}
</style>