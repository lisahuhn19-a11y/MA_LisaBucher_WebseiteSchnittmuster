<script setup>
import { auth } from '@/firebase';


</script>

<template>
  <div>
    <h1>Willkommen {{auth}}</h1>
    <h2>Dein Konto</h2>
    <p>noch nicht angemeldet? hier gehts zur Login-Seite</p>
    <RouterLink to="/login">Login</RouterLink>
    <p>Hier findest du alle deine Masse und hochgeladenen Fotos</p>
  </div>
</template>