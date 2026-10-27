<!-- Seite für Langarmshirt -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import {jsPDF} from 'jspdf'
import 'svg2pdf.js'

// Daten für Firebase
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
  { id: 'MoL', label: 'Modelllänge', value: 50, unit: 'cm' },
  { id: 'KoeH', label: 'Körperhöhe', value: 168, unit: 'cm' },
  { id: 'BrU',  label: 'Brustumfang', value: 88, unit: 'cm' },
  { id: 'TaU',  label: 'Taillenumfang', value: 72, unit: 'cm' },
  { id: 'HueU', label: 'Hüftumfang', value: 97, unit: 'cm' },
  { id: 'AlT',  label: 'Armlochtiefe', value: 20, unit: 'cm' },
  { id: 'HueT', label: 'Hüfttiefe', value: 21, unit: 'cm' },
  { id: 'BrT',  label: 'Brusttiefe', value: 28, unit: 'cm' },
  { id: 'ArD',  label: 'Armdurchmesser', value: 9.3, unit: 'cm' },
  { id: 'BrPa', label: 'Brustpunktabstand', value: 9, unit: 'cm' },
  { id: 'SuB',  label: 'Schulterbreite', value: 12, unit: 'cm' },
  { id: 'SuWi', label: 'Schulterwinkel', value: 20, unit: '°' },
  { id: 'RueL', label: 'Rückenlänge', value: 41, unit: 'cm' },
  { id: 'VL',   label: 'Vorderlänge', value: 45, unit: 'cm' },
  { id: 'ArL',  label: 'Armlänge', value: 60, unit: 'cm' },
  { id: 'OaU',  label: 'Oberarmumfang', value: 28, unit: 'cm' },
  { id: 'HgU',  label: 'Handgelenkumfang', value: 16, unit: 'cm' },
  { id: 'HlB',  label: 'Halslochbreite', value: 6.5, unit: 'cm' }
])

//berechntete Masse
const measurementsCalc = computed(() => [
  {id: 'AlT+', value: getVal('AlT')+0.5},
  {id: 'BrW', value: getVal('BrU')+8},
  {id: 'SuNL', value: getVal('SuB')+1.5},
  {id: 'SuWi+', value: (getVal('SuWi')*Math.PI)/180},
  {id: 'AESaW', value: getVal('HgU')+6},
  {id: 'ArD+', value: getVal('ArD')+1.5}
])

const statusMessage = ref('')

// SVG's für die einzelnen Schnittteile
const vorderTeil = computed(() => {

  const p3x = 0
  const p3y = getVal('MoL')

  const p5y = getVal('RueL')

  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')

  const p7x = p6x - getVal('ArD+')/2
  const p7y = getVal('AlT+')
  
  const p9x = getVal('HlB')+0.5
  const p9y = 0

  const p10vx = p9x - 1.5*Math.sin(getVal('SuWi+'))
  const p10vy = p9y + 1.5*Math.cos(getVal('SuWi+'))
  
  const p8vx = p10vx + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8vy = p10vy + getVal('SuNL')*Math.sin(getVal('SuWi+'))
  
  const p11x = 0
  const p11y = getVal('HlB') + 2.5

  const p12x = p6x - 1
  const p12y = p3y

  const p98x = p7x + 1
  const p98y = getVal('AlT+')*0.75

  const p99x = p7x
  const p99y = p7y - getVal('AlT+')/2

  const kpp99x = 2*p99x - 0.5*p8vx - 0.5*p98x
  const kpp99y = 2*p99y - 0.5*p8vy - 0.5*p98y

  const kpp7x = p7x*1.1
  const kpp7y = p7y - (p7y - p98y)*0.3

  return `M ${p11x} ${p11y} L ${p3x} ${p3y} L ${p12x} ${p12y} C ${p12x} ${p12y}, ${p12x} ${p5y}, ${p6x} ${p6y} Q ${kpp7x} ${kpp7y}, ${p98x} ${p98y} C ${p98x} ${p98y}, ${kpp99x} ${kpp99y}, ${p8vx} ${p8vy} L ${p10vx} ${p10vy} C ${p10vx} ${p10vy}, ${p10vx} ${p11y}, ${p11x} ${p11y}`
})

const hinterTeil = computed(() => {

  const p2x = 0
  const p2y = getVal('HlB')/3

  const p3x = 0
  const p3y = getVal('MoL')

  const p5x = 0
  const p5y = getVal('RueL')

  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')

  const p7x = p6x - getVal('ArD+')/2
  const p7y = getVal('AlT+')
  
  const p9x = getVal('HlB')+0.5
  const p9y = 0

  const p10hx = p9x + 1.5*Math.sin(getVal('SuWi+'))
  const p10hy = p9y - 1.5*Math.cos(getVal('SuWi+'))

  const p8x = p9x + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8y = p9y + getVal('SuNL')*Math.sin(getVal('SuWi+'))
  
  const p8hx = p10hx + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8hy = p10hy + getVal('SuNL')*Math.sin(getVal('SuWi+'))

  const p12x = p6x - 1
  const p12y = p3y

  const p98x = p7x + 1
  const p98y = getVal('AlT+')*0.75

  const p99x = p7x
  const p99y = p7y - getVal('AlT+')/2

  const kpp99x = 2*p99x - 0.5*p8x - 0.5*p98x
  const kpp99y = 2*p99y - 0.5*p8y - 0.5*p98y

  const kpp6x = p6x
  const kpp6y = p6y - (p7y - p98y)*0.3

  const kpp7x = p7x*1.1
  const kpp7y = p7y - (p7y - p98y)*0.3

  //return `M ${p2x} ${p2y} L ${p3x} ${p3y} L ${p12x} ${p12y} C ${p12x} ${p12y}, ${p12x} ${p5y}, ${p6x} ${p6y} C ${p6x} ${p6y}, ${p7x} ${p7y}, ${p8hx} ${p8hy} L ${p10hx} ${p10hy} C ${p10hx} ${p10hy}, ${p10hx} ${p2y}, ${p2x} ${p2y}`
  return `M ${p2x} ${p2y} L ${p3x} ${p3y} L ${p12x} ${p12y} C ${p12x} ${p12y}, ${p12x} ${p5y}, ${p6x} ${p6y} Q ${kpp7x} ${kpp7y}, ${p98x} ${p98y} C ${p98x} ${p98y}, ${kpp99x} ${kpp99y}, ${p8x} ${p8y} L ${p8hx} ${p8hy} L ${p10hx} ${p10hy} C ${p10hx} ${p10hy}, ${p10hx} ${p2y}, ${p2x} ${p2y}`

})

const aermel = computed(() => {
  const p2x = 0
  const p2y = getVal('HlB')/3

  const p3x = 0
  const p3y = getVal('MoL')

  const p6x = getVal('BrW')/4
  const p6y = getVal('AlT+')

  const p7x = p6x - getVal('ArD+')/2
  const p7y = getVal('AlT+')

  const p9x = getVal('HlB')+0.5
  const p9y = 0

  const p8x = p9x + getVal('SuNL')*Math.cos(getVal('SuWi+'))
  const p8y = p9y + getVal('SuNL')*Math.sin(getVal('SuWi+'))

  const p98x = p7x + 1
  const p98y = getVal('AlT+')*0.75

  const p99x = p7x
  const p99y = p7y - getVal('AlT+')/2

  const kpp99x = 2*p99x - 0.5*p8x - 0.5*p98x
  const kpp99y = 2*p99y - 0.5*p8y - 0.5*p98y

  const kpp6x = p6x
  const kpp6y = p6y - (p7y - p98y)*0.3

  const kpp7x = p7x*1.1
  const kpp7y = p7y - (p7y - p98y)*0.3

  const p14x = p8x + Math.cos(getVal('SuWi+'))*getVal('ArL')
  const p14y = p8y + Math.sin(getVal('SuWi+'))*getVal('ArL')

  const p15x = p14x - getVal('AESaW')/2*Math.sin(getVal('SuWi+'))
  const p15y = p14y + getVal('AESaW')/2*Math.cos(getVal('SuWi+'))

  const p17x = 0
  const p17y =0

  const x = Math.abs(Math.sqrt((Math.abs(p6x-p98x))**2 + (Math.abs(p6y-p98y))**2 ))

  const alpha = 2*Math.asin((0.5*getVal('ArD+')-1)/(2*x))
  const beta = (Math.asin((p6y-p98y)/(p6x-p98x)))
  const gamma = (90*Math.PI/180) - (alpha + beta)

  const p16x = p98x + Math.cos(gamma) * (0.5*getVal('ArD+')-1)
  const p16y = p98y + Math.sin(gamma) * (0.5*getVal('ArD+')-1)

  return `M ${p98x} ${p98y} C ${p98x} ${p98y}, ${kpp99x} ${kpp99y}, ${p8x} ${p8y} L ${p14x} ${p14y} L ${p15x} ${p15y} L ${p16x} ${p16y}`

})

//console.log(alpha, beta)

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

const firstName = computed(() => {
  if (!currentUser.value || !currentUser.value.displayName) return ''
  return currentUser.value.displayName.split(' ')[0]
})

const downloadA4PDF = async () => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const svgElement = document.querySelector('.pattern-svg-export')
  if (!svgElement) return

  await pdf.svg(svgElement, {
    x: 10,
    y: 10,
    width: 800,
    height: 600
  })

  pdf.save('schnittmusterLangarmshirt.pdf')
}


</script>


<template>
  <div class="app-container">
    <div class="info-header">
      <h1>Langarmshirt</h1>
      <p>(Info's zum Schnittmuster)</p>
      
      <button @click="saveToFirebase">Änderungen speichern</button>
      <button @click="downloadA4PDF" class="btn-pdf">PDF herunterladen</button>
      <span v-if="statusMessage">{{ statusMessage }}</span>
    </div>

    <!-- MAIN: Links SVG, Rechts Inputs -->
    <div class="content-layout">
      
      <!-- LINKS: SVG Anzeige (Verkleinert, mit weißem Hintergrund und 2 Pfaden) -->
      <div class="svg-container">
        <h2>Schnittmuster</h2>
        
        <svg viewBox="0 0 800 500" class="pattern-svg">
          <!-- Weißer Hintergrund für das SVG -->
          <rect width="100%" height="100%" fill="white" />

          <g transform="translate(50,50)">
            <path :d="vorderTeil" stroke="#4f46e5" stroke-width="0.5" fill="none" />
            <text x="70" y="120" font-size="11" fill="#4f46e5">Vorderteil</text>
          </g>

          <g transform="translate(200,50)">
            <path :d="hinterTeil" fill="none" stroke="#10b981" stroke-width="0.5" />
          </g>

          <g transform="translate(400,50)">
            <path :d="aermel" fill="none" stroke="#676767" stroke-width="0.5" />
          </g>
        </svg>
      </div>

      <div style="display:none;">
        <svg viewBox="0 0 800 500" class="pattern-svg-export">
          <rect width="100%" height="100%" fill="white" />
          <g transform="translate(50,50)">
            <path :d="vorderTeil" stroke="black" stroke-width="0.5" fill="none" />
          </g>
          <g transform="translate(200,50)">
            <path :d="hinterTeil" fill="none" stroke="black" stroke-width="0.5" />
          </g>
          <g transform="translate(400,50)">
            <path :d="aermel" fill="none" stroke="black" stroke-width="0.5" />
          </g>
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