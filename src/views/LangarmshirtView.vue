<!-- Seite für Langarmshirt -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD2whdIYR0QlMrYS4ASEyRCZXPHLfSFQCc",
  authDomain: "miaumass.firebaseapp.com",
  projectId: "miaumass",
  storageBucket: "miaumass.firebasestorage.app",
  messagingSenderId: "987929718658",
  appId: "1:987929718658:web:274ac9bc8bf2f911bf299b"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const getVal = (id) => {
  const item = measurements.value.find(m => m.id === id)
  if (item) {
    return Number(item.value) || 0
  }
  const calcItem = measurementsCalc.value.find(m => m.id === id)
  return calcItem ? Number(calcItem.value) || 0 : 0
}

//gemessene Masse
const measurements = ref([
  { id: 'MoL', label: 'Modelllänge', value: 45, unit: 'cm' },
  { id: 'KoeH', label: 'Körperhöhe', value: 170, unit: 'cm' },
  { id: 'BrU',  label: 'Brustumfang', value: 88, unit: 'cm' },
  { id: 'TaU',  label: 'Taillenumfang', value: 70, unit: 'cm' },
  { id: 'HueU', label: 'Hüftumfang', value: 96, unit: 'cm' },
  { id: 'AlT',  label: 'Ausschnittiefe', value: 42, unit: 'cm' },
  { id: 'HueT', label: 'Hüfttiefe', value: 20, unit: 'cm' },
  { id: 'BrT',  label: 'Brusttiefe', value: 34, unit: 'cm' },
  { id: 'ArD',  label: 'Armdurchmesser', value: 10, unit: 'cm' },
  { id: 'BrPa', label: 'Brustpunktabstand', value: 18, unit: 'cm' },
  { id: 'SuB',  label: 'Schulterbreite', value: 38, unit: 'cm' },
  { id: 'SuWi', label: 'Schulterwinkel', value: 25, unit: '°' },
  { id: 'RueL', label: 'Rückenlänge', value: 40, unit: 'cm' },
  { id: 'VL',   label: 'Vorderlänge', value: 43, unit: 'cm' },
  { id: 'ArL',  label: 'Armlänge', value: 60, unit: 'cm' },
  { id: 'OaU',  label: 'Oberarmumfang', value: 30, unit: 'cm' },
  { id: 'HgU',  label: 'Handgelenkumfang', value: 18, unit: 'cm' },
  { id: 'HlB',  label: 'Halslochbreite', value: 14, unit: 'cm' }
])

//berechntete Masse
const measurementsCalc = ref ([
  {id: 'AlT+', value: getVal('AlT')+0.5},
  {id: 'BrW', value: getVal('BrU')+8}
])

const statusMessage = ref('')

// SVG's für die einzelnen Schnittteile
const vorderTeil = computed(() => {
  //const p1x = 0
  //const p1y = 0
  //const p2x = 0
  //const p2y = getVal('HlB')/3
  const p3x = 0
  const p3y = getVal('MoL')
  //const p4x = 0
  //const p4y = getVal('AlT+')
  //const p5x = 0
  //const p5y = getVal('RueL')
  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')
  const p7x = getVal('p6x')-getVal('AlT+')/2
  const p7y = getVal('AlT+')
  const p8vx = getVal('p10vx') + 1.5*Math.cos(getVal('SuWi'))
  const p8vy = getVal('p10vy') - 1.5*Math.cos(getVal('SuWi'))
  const p9x = getVal('HlB')+0.5
  const p9y = 0
  const p10vx = getVal('p9x') - 1.5*Math.sin(getVal('SuWi'))
  const p10vy = getVal('p9y') - 1.5*Math.cos(getVal('SuWi'))
  const p11x = 0
  const p11y = getVal('HlB') + 2.5
  const p12x = getVal('p6x') - 1
  const p12y = getVal('p3y')

  return `M ${p11x} ${p11y} L ${p3x} ${p3y} L ${p12x} ${p12y} L ${p6x} ${p6y} C ${p6x} ${p6y}, ${p7x} ${p7y}, ${p8vx} ${p8vy}, L ${p10vx} ${p10vy}, C ${p10vx} ${p10vy}, 0 0, ${p11x} ${p11y}`
})

const hinterTeil = computed(() => {
  //const p1x = 0
  //const p1y = 0
  //const p2x = 0
  //const p2y = getVal('HlB')/3
  const p3x = 0
  const p3y = getVal('MoL')
  //const p4x = 0
  //const p4y = getVal('AlT+')
  //const p5x = 0
  //const p5y = getVal('RueL')
  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')
  const p7x = getVal('p6x')-getVal('AlT+')/2
  const p7y = getVal('AlT+')
  const p9x = getVal('HlB')+0.5
  const p9y = 0
  const p10vx = getVal('p9x') - 1.5*Math.sin(getVal('SuWi'))
  const p10vy = getVal('p9y') - 1.5*Math.cos(getVal('SuWi'))
  const p8vx = getVal('p10vx') + 1.5*Math.cos(getVal('SuWi'))
  const p8vy = getVal('p10vy') - 1.5*Math.cos(getVal('SuWi'))
  const p11x = 0
  const p11y = getVal('HlB') + 2.5
  const p12x = 0
  const p12y = 0

  return `M 0 0`
})

const aermel = computed(() => {
  const p13x = 0
  const p13y = 0
  const p14x = 0
  const p14y = 0
  const p15x = 0
  const p15y = 0
  const p16x = 0
  const p16y = 0
  const p17x = 0
  const p17y = 0

  return `M p13x p13y L `
})

const loadSizesFromFirebase = async () => {
  try {
    statusMessage.value = 'Lade Daten...'
    const docRef = doc(db, 'schnittmuster', 'defaultUser')
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      measurements.value.forEach(item => {
        if (data[item.id] !== undefined) {
          item.value = data[item.id]
        }
      })
      statusMessage.value = 'Daten erfolgreich geladen'
    } else {
      statusMessage.value = 'Keine Daten in Firebase vorhanden'
    }
  } catch (e) {
    console.error(e)
    statusMessage.value = 'Fehler beim Laden'
  }
}

const saveToFirebase = async () => {
  try {
    statusMessage.value = 'Speichere...'
    const docRef = doc(db, 'schnittmuster', 'defaultUser')
    
    const dataToSave = {}
    measurements.value.forEach(item => {
      dataToSave[item.id] = item.value
    })

    await setDoc(docRef, dataToSave)
    statusMessage.value = 'Gespeichert!'
  } catch (e) {
    console.error(e)
    statusMessage.value = 'Fehler beim Speichern'
  }
}

onMounted(() => {
  loadSizesFromFirebase()
})
</script>


<template>
  <div class="app-container">
    <div class="info-header">
      <h1>Langarmshirt</h1>
      <p>Hier kannst du später Informationen, Stoffempfehlungen oder Anleitungen einfügen.</p>
      
      <button @click="saveToFirebase">In Firebase speichern</button>
      <span v-if="statusMessage">{{ statusMessage }}</span>
    </div>

    <!-- MAIN: Links SVG, Rechts Inputs -->
    <div class="content-layout">
      
      <!-- LINKS: SVG Anzeige (Verkleinert, mit weißem Hintergrund und 2 Pfaden) -->
      <div class="svg-container">
        <h3>Schnittmuster</h3>
        
        <svg viewBox="0 0 400 300" class="pattern-svg">
          <!-- Weißer Hintergrund für das SVG -->
          <rect width="100%" height="100%" fill="white" stroke="#ddd" rx="4" />

          <!-- Pfad 1: Vorderteil -->
          <path :d="vorderTeil" fill="rgba(79, 70, 229, 0.1)" stroke="#4f46e5" stroke-width="2" />
          <text x="70" y="120" font-size="11" fill="#4f46e5">Vorderteil</text>

          <!-- Pfad 2: Ärmel (Zweiter SVG-Pfad) -->
          <!--<path :d="hinterTeil" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" stroke-width="2" />
          <text x="235" y="110" font-size="11" fill="#10b981">Ärmel</text> -->
        </svg>
      </div>

      <!-- RECHTS: Inputs -->
      <div class="inputs-container">
        <h3>Benötigte Maße</h3>
        
        <div class="inputs-scroll">
          <div v-for="item in measurements" :key="item.id" class="input-item">
            <label :for="item.id">{{ item.label }} ({{ item.id }})</label>
            <div class="input-field-wrapper">
              <input 
                type="number" 
                :id="item.id" 
                v-model.number="item.value" 
                step="0.5"
              />
              <span>{{ item.unit }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Minimales Layout-Styling, Rest läuft über globales CSS */
.app-container {
  padding: 20px;
}

.info-header {
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 20px;
}

.content-layout {
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: flex-start;
}

.svg-container {
  flex: 1;
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  max-width: 450px;
}

.pattern-svg {
  width: 100%;
  height: auto;
}

.inputs-container {
  flex: 1.2;
  background: #fff;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.inputs-scroll {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 5px;
}

.input-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.input-item label {
  flex: 2;
  font-size: 0.9rem;
}

.input-field-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
}

.input-field-wrapper input {
  width: 80px;
  padding: 4px;
}
</style>