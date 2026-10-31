<!-- src/App.vue -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
import logo from './assets/MLogoMiauMass.svg'
</script>

<template>

  <div class="layout-container">
    <header class="navbar">
      <div class="navbar-content">
        <div class="navbar-logo-container">
          <img :src="logo" alt="Logo" class="navbar-logo"/>
        </div>
      
        <nav>
          <RouterLink to="/">Startseite</RouterLink>
          <RouterLink to="/schnittmuster">alle Schnittmuster</RouterLink>
          <RouterLink to="/langarmshirt">Langarmshirt</RouterLink>
          <!--<RouterLink to="/messen">Masse nehmen</RouterLink> -->
          <RouterLink to="/messen1">Messen 1</RouterLink>
          <RouterLink to="/messen2">Messen 2</RouterLink>
          <RouterLink to="/messen3">Messen 3</RouterLink>
          <!--<RouterLink to="/gallerie">Gallerie</RouterLink> -->
          <RouterLink to="/ueber-mich">Über mich</RouterLink>
          <!--<RouterLink to="/login">Login</RouterLink> -->
          <RouterLink to="/profil">Profil</RouterLink>
        </nav>
      </div>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <footer class="footer">
      <img :src="logo" alt="Logo" class="footer-logo"/>
      <p>Maturaarbeit von Lisa Bucher | Kontakt: lisahuhn19@gmail.com</p>
      <p>&copy; 2026 Alle Rechte vorbehalten</p>
      <p><router-link to="/impressum">Impressum</router-link> | <router-link to="/datenschutz">Datenschutz</router-link> </p>
    </footer>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.navbar {
  background-color: #3A0E60;
  height: 80px;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-content {
  max-width: 1000px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav {
  margin-right: 0;
}

nav a:last-child {
  margin-right: 0;
}

.navbar-logo-container {
  height: 100%;
  display: flex;
  align-items: center;
}

.navbar-logo {
  height: 80%;
  width: auto;
  object-fit: contain;
}

nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: #e1e1e1;
  font-weight: 500;
}

nav a.router-link-exact-active {
  color: #e1e1e1;
  border-bottom: 2px solid #e1e1e1;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #3A0E60;
  color: #e1e1e1;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

.footer-logo {
  height: 40px;
  width: auto;
  display: block;
  margin: 0 auto 0.8rem auto;
}

.footer p {
  margin: 0.2rem 0;
}
</style>