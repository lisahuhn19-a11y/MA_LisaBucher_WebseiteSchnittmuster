<!-- src/App.vue -->
<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

  <div class="layout-container">
    <header class="navbar">
      <div class="logo">MiauMass</div>
      <nav>
        <RouterLink to="/">Startseite</RouterLink>
        <RouterLink to="/schnittmuster">alle Schnittmuster</RouterLink>
        <!--<RouterLink to="/messen">Masse nehmen</RouterLink> -->
        <RouterLink to="/messen1">Masse nehmen 1</RouterLink>
        <RouterLink to="/messen2">Masse nehmen 2</RouterLink>
        <RouterLink to="/messen3">Masse nehmen 3</RouterLink>
        <!--<RouterLink to="/gallerie">Gallerie</RouterLink> -->
        <RouterLink to="/ueber-mich">Über mich</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/profil">Profil</RouterLink>
      </nav>
    </header>

    <main class="content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>Maturaarbeit von Lisa Bucher | Kontakt: lisahuhn19@gmail.com</p>
      <p>&copy; 2026 Alle Rechte vorbehalten</p>
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
  background-color: #ff87c4;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

nav a {
  margin-left: 1.5rem;
  text-decoration: none;
  color: #73003b;
  font-weight: 500;
}

/* Hebt den aktuell aktiven Menüpunkt hervor */
nav a.router-link-exact-active {
  color: #73003b;
  border-bottom: 2px solid #73003b;
}

.content {
  flex: 1;
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  background-color: #545a43;
  color: #ffe88b;
  text-align: center;
  padding: 1.5rem;
  font-size: 0.9rem;
}

.footer p {
  margin: 0.2rem 0;
}
</style>