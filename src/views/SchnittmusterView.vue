<!-- src/views/StartseiteView.vue -->
<script setup>
import langarmshirtFoto1 from '@/assets/LangarmshirtFoto1.jpg'
import massstab from '@/assets/Massstab.svg'
import stern from '@/assets/Stern.svg'
import stoffrolle from '@/assets/Stoffrolle.svg'

// Liste aller Schnittmuster: für ein neues Schnittmuster einfach einen Eintrag hinzufügen
const schnittmuster = [
  {
    name: 'Langarmshirt',
    merkmale: [
      { icon: massstab, text: 'massgeschneidert' },
      { icon: stern, text: 'anfängerfreundlich' },
      { icon: stoffrolle, text: 'Jersey' }
    ],
    bild: langarmshirtFoto1,
    route: '/langarmshirt'
  }
]
</script>

<template>
  <div>
    <h1>alle Schnittmuster</h1>
    <h2>hier findest du eine später Auswahl an Schnittmuster</h2>
    <p>Diese Seite befindet sich momentan noch im Aufbau. Schau Anfangs Dezember nochmals vorbei um dein perfektes Schnittmuster zu finden!</p>

    <div class="kachel-raster">
      <RouterLink
        v-for="muster in schnittmuster"
        :key="muster.route"
        :to="muster.route"
        class="kachel"
      >
        <div class="kachel-bild">
          <img v-if="muster.bild" :src="muster.bild" :alt="muster.name" />
        </div>
        <div class="kachel-text">
          <h2>{{ muster.name }}</h2>
          <ul class="kachel-merkmale">
            <li v-for="merkmal in muster.merkmale" :key="merkmal.text">
              <img class="kachel-icon" :src="merkmal.icon" alt="" />{{ merkmal.text }}
            </li>
          </ul>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.kachel-raster {
  display: grid;
  grid-template-columns: repeat(auto-fill, 245px);
  gap: 60px;
}

.kachel {
  display: block;
  min-height: 285px;
  padding: 10px 10px 20px;
  background-color: #ffffff;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
}

.kachel-bild {
  aspect-ratio: 3 / 2;
  border-radius: 12px;
  overflow: hidden;            /* damit das Bild die runden Ecken übernimmt */
  background-color: #d9d9d9;   /* grauer Platzhalter, solange kein Bild da ist */
}

.kachel-bild img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.kachel-text h2 {
  font-size: 28px;
  margin: 8px 0 4px;
}

.kachel-merkmale {
  list-style: none;
  margin-bottom: 0;
  font-size: 14px;
  line-height: 1.3;
}

.kachel-icon {
  width: 16px;
  height: 16px;                /* gleich gross, auch wenn die SVGs nicht ganz quadratisch sind */
  margin-right: 6px;
  vertical-align: middle;
}
</style>
