<!-- src/views/StartseiteView.vue -->
<script setup>
import logo from '../assets/LogoMiauMass.svg'
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
    
    <p>1. Erfasse deine Masse -> 2. Suche dein Schnittmuster aus -> 3. Lade das PDF herunter und drucke es aus -> 4. bereit zum nähen</p>

    <div v-if="!currenUser">
      <p>Registriere dich <RouterLink to="/registrieren">hier</RouterLink> an, um deine Masse zu speichern.</p>
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