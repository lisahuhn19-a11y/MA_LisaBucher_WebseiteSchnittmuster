<!-- src/views/StartseiteView.vue -->
<script setup>

import {ref, computed, onMounted, watch} from 'vue'
import {auth, db} from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const currentUser = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)

onMounted(() => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            currentUser.value = user
            await loadUserMeasurements(user.uid)
        } else {
            currentUser.value = null
        }
        isLoading.value = false
    })
})

async function loadUserMeasurements(uid) {
    try {
        const docRef = doc(db, 'userMeasurements', uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
            const data = docSnap.data()
            measurements.value.forEach(m => {
                if (data[m.id] !== undefined) {
                    m.value = data[m.id]
                }
            })
        }
    } catch (error) {
        console.error('Fehler beim Laden der Maße:', error)
    }
}

async function saveMeasurements() {
    if (!currentUser.value) return
    
    isSaving.value = true
    try {
        const measurementsData = {}
        measurements.value.forEach(m => {
            measurementsData[m.id] = m.value
        })

        const docRef = doc(db, 'userMeasurements', currentUser.value.uid)
        await setDoc(docRef, measurementsData, { merge: true })
    } catch (error) {
        console.error('Fehler beim Speichern:', error)
    } finally {
        isSaving.value = false
    }
}

const viewModes = [
    {id: 'all', name: 'Alle Masse'},
    {id: 'specific', name: 'Nur für spezifisches Kleidungsstück'}
]

const viewMode = ref('all')

const clothes=ref([
    {id: 'rock', name: 'Rock'},
    {id: 'top', name: 'Top'},
    {id: 'hose', name: 'Hose'},
    {id: 'shirt', name: 'Shirt'}
])

const selectedCloth = ref('rock')
const selectedSize = ref('M')

const sizeChart = {
    S: {KoeH:168, BrU:84, uBrU:74, TaU:68, HueU:94, HaU:35.4, HlB:6.4, AlT:19.7, gRueL: 41.4, HueT: 21, gBrT:27.3, gVL: 44.7, oRueB: 17.2, gRueB: 16, gArD: 8.6, gBrB: 17.4, BrPA: 8.4, SuB: 12.1, SuWi: 20, ArL: 59.8, OaU: 26.8, HagU: 15.4, sTaA: 106, OsU: 53.8, SiH: 25.7, SrH: 80.3, FeU: 24, vTaA: 42.9, hTaA: 40.9, sTaH: 102, RueL: 41.4, BrT: 27.3, KnU: 35.5, uKnU: 31.5, WaU: 34.5, RiU: 20},
    M: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, gRueL: 41.6, HueT: 21, gBrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5, vTaA: 43.5, hTaA: 41.5, sTaH: 103, RueL: 41.6, BrT: 28.1, KnU: 37, uKnU: 33, WaU: 36, RiU: 22},
    L: {KoeH:168, BrU:92, uBrU:80, TaU:76, HueU:100, HaU:36.6, HlB:6.6, AlT:20.5, gRueL: 41.8, HueT: 21, gBrT:28.9, gVL: 45.9, oRueB: 18.2, gRueB: 17, gArD: 10, gBrB: 19, BrPA: 9.2, SuB: 12.4, SuWi: 20, ArL: 60.2, OaU: 29.2, HagU: 16.2, sTaA: 106, OsU: 57.4, SiH: 26.5, SrH: 79.5, FeU: 25, vTaA: 44.1, hTaA: 42.1, sTaH: 104, RueL: 41.8, BrT: 28.9, KnU: 38.5, uKnU: 34.5, WaU: 37.5, RiU: 24},
    XL: {KoeH:168, BrU:96, uBrU:84, TaU:80, HueU:103, HaU:37.2, HlB:6.7, AlT:20.9, gRueL: 42, HueT: 21, gBrT:29.7, gVL: 46.5, oRueB: 18.7, gRueB: 17.5, gArD: 10.7, gBrB: 19.8, BrPA: 9.6, SuB: 12.6, SuWi: 20, ArL: 60.4, OaU: 30.4, HagU: 16.6, sTaA: 106, OsU: 59.2, SiH: 26.9, SrH: 79.1, FeU: 25.5, vTaA: 44.7, hTaA: 42.7, sTaH: 105, RueL: 42, BrT: 29.7, KnU: 40, uKnU: 36, WaU: 39, RiU: 26}
}

const measurements = ref([
    {id: 'KoeH', label: 'Körperhöhe', value: null, unit: 'cm', tags:['top', 'shirt']},
    {id: 'BrU', label: 'Brustumfang', value: null, unit: 'cm', tags:['top', 'shirt']},
    {id: 'TaU', label: 'Taillenumfang waagerecht', value: null, unit: 'cm', tags: ['rock', 'top', 'hose', 'shirt']},
    {id: 'HueU', label: 'Hüftumfang', value: null, unit: 'cm', tags:['rock', 'top', 'hose', 'shirt']},
    //{id: 'nTaU', label: 'natürlicher Taillenumfang', value: null, unit: 'cm', tags:[]},
    {id: 'vTaA', label: 'vorderer Taillenabstand', value: null, unit: 'cm', tags:['rock']},
    {id: 'sTaA', label: 'seitlicher Taillenabstand', value: null, unit: 'cm', tags:['rock']},
    {id: 'hTaA', label: 'hinterer Taillenabstand', value: null, unit: 'cm', tags: ['rock']},
    //{id: 'vTaH', label: 'vordere Taillenhöhe', value: null, unit:'cm', tags:[]},
    //{id: 'hTaH', label: 'hintere Taillenhöhe', value: null, unit: 'cm', tags:[]},
    {id: 'sTaH', label: 'seitliche Taillenhöhe', value: null, unit: 'cm', tags: ['hose']},
    //{id: 'HaU', label: 'Halsansatzumfang', value: null, unit: 'cm', tags:[]},
    {id: 'gRueL', label: 'Rückenlänge', value: null, unit: 'cm', tags:['top', 'shirt']},
    {id: 'gBrT', label: 'Brusttiefe', value: null, unit: 'cm', tags:['top', 'shirt']},
    {id: 'gVL', label: 'Vorderlänge', value: null, unit: 'cm', tags:['top', 'shirt']},
    {id: 'oRueB', label: 'obere Rückenbreite', value: null, unit: 'cm', tags:[]},
    {id: 'AlT', label: 'Armlochtiefe', value: null, unit: 'cm', tags:['top', 'shirt']},
    {id: 'gRueB', label: 'gemessene Rückenbreite', value: null, unit: 'cm', tags:['top']},
    {id: 'gArD', label: 'Armdurchmesser', value: null, unit: 'cm', tags:['top', 'shirt']},
    {id: 'gBrB', label: 'Brustbreite', value: null, unit: 'cm', tags:['top']},
    {id: 'BrPA', label: 'Brustpunktabstand', value: null, unit: 'cm', tags:['shirt']},
    //{id: 'oBrB', label: 'obere Brustbreite', value: null, unit: 'cm', tags:[]},
    //{id: 'oBrA', label: 'Oberbrustabstand', value: null, unit: 'cm', tags:[]},
    //{id: 'uBrU', label: 'Unterbrustumfang', value: null, unit: 'cm', tags:[]},
    //{id: 'uBrA', label: 'Unterbrustabstand', value: null, unit: 'cm', tags:[]},
    {id: 'SuB', label: 'Schulterbreite', value: null, unit: 'cm', tags:['top', 'shirt']},
    //{id: 'ArL', label: 'Armlänge', value: null, unit: 'cm', tags:[]},
    {id: 'OaU', label: 'Oberarmumfang', value: null, unit: 'cm', tags:['shirt']},
    {id: 'HagU', label: 'Handgelenkumfang', value: null, unit: 'cm', tags:['shirt']},
    //{id: 'HanU', label: 'Handumfang', value: null, unit: 'cm', tags:[]},
    //{id: 'AraU', label: 'Armansatzumfang', value: null, unit: 'cm', tags:[]},
    {id: 'SuWi', label: 'Schulterwinkel', value: null, unit: '°', tags:['top', 'shirt']},
    //{id: 'SuH', label: 'Schulterhöhe', value: null, unit: 'cm', tags:[]},
    {id: 'HueT', label: 'Hüfttiefe', value: null, unit: 'cm', tags:['rock', 'top', 'shirt']},
    {id: 'SiH', label: 'Sitzhöhe', value: null, unit: 'cm', tags:['hose']},
    {id: 'SrH', label: 'Schritthöhe', value: null, unit: 'cm', tags:['hose']},
    {id: 'OsU', label: 'Oberschenkelumfang', value: null, unit: 'cm', tags:['hose']},
    {id: 'KnU', label: 'Knieumfang', value: null, unit: 'cm', tags:['hose']},
    {id: 'uKnU', label: 'Unterknieumfang', value: null, unit: 'cm', tags:['hose']},
    {id: 'WaU', label: 'Wadenumfang', value: null, unit: 'cm', tags:['hose']},
    {id: 'FeU', label: 'Fesselumfang', value: null, unit: 'cm', tags:['hose']},
    {id: 'RiU', label: 'Ristumfang', value: null, unit: 'cm', tags:['hose']}
])

function applyStandardSize() {
    const chartValues = sizeChart[selectedSize.value]
    if (!chartValues) return

    measurements.value.forEach(m => {
        if (chartValues[m.id] !== undefined) {
            m.value = chartValues[m.id]
        }
    })
}

const relevantMeasurements = computed(() => {
    if (viewMode.value === 'all') {
        return measurements.value
    }
    return measurements.value.filter(m => m.tags.includes(selectedCloth.value))
})
</script>

<template>
    <h1>Variante 1</h1>

    <div v-if="isLoading">
        <p>Seite ist am laden...</p>
    </div>

    <div v-else-if="!currentUser">
        <p>Du bist noch nicht angemeldet. Melde dich <RouterLink to="/login">hier</RouterLink> an, um deine Masse später zu speichern!</p>
    </div>

    <div v-else>
        <h2>wichtiges zum Messen</h2>
        <ul>
            <li>Suche eine Person, die dir beim Messen hilft. Besonders für die Rückenmasse ist es schwierig sich selbst zu messen.</li>
            <li>Trage eng anliegende Kleidung oder Unterwäsche, damit deine Körperform gut sichtbar ist.</li>
            <li>Benutze ein flexibles Massband.</li>
            <li>Halte Klebeband, Schnur oder Kajalstift bereit, um gewisse Punkte am Körper zu markieren.</li>
            <li>Messe dich am besten vor einem Spiegel, damit du gut siehts wo das Messband liegt.</li>
            <li>Achte beim Vermessen auf eine aufrechte Haltung.</li>
            <li>Achte darauf, dass das Massband deinen Körper berührt, jedoch nicht einschneidet. (nicht schummeln ;-)</li>
        </ul>
        <h2>vor dem Messen</h2>
        <ul>
            <li>Markiere deine Taille, indem du eine Schnur oder ähnliches herumbindest.</li>
            <li>Markiere den 7. Halswirbel mit einem Stück Klebeband oder Kajalstift. Der 7. 
                Halswirbel ertastest du, indem du den Kopf leicht nach vorne neigst. Der Knochen, der 
                jetzt am stärksten im Nacken hervorsteht ist dein 7. Halswirbel.</li>
        </ul>

        <div class="controls">
            <div class="form-container">
                <div class="box-container">
                    <div class="form-group mode-selection">
                        <label>Anzeige:</label>
                        <div class="radio-group">
                            <label v-for="mode in viewModes" :key="mode.id" class="radio-label">
                                <input
                                    type="radio"
                                    name="viewMode"
                                    :value="mode.id"
                                    v-model="viewMode"
                                />
                                {{ mode.name }}
                            </label>
                        </div>
                    </div>

                    <div class="form-group" v-if="viewMode === 'specific'">
                        <label for="cloth-selected">Kleidungsstück:</label>
                        <select id="cloth-select" v-model="selectedCloth">
                            <option v-for="item in clothes" :key="item.id" :value="item.id">
                                {{ item.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="size-select">Standardgrösse laden:</label>
                        <select id="size-select" v-model="selectedSize" @change="applyStandardSize">
                            <option value="S">Grösse S</option>
                            <option value="M">Grösse M</option>
                            <option value="L">Grösse L</option>
                            <option value="XL">Grösse XL</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="measurements-container">
                <template v-for="item in relevantMeasurements" :key="item.id">
                    <label :for="item.id" class="measurement-label">{{ item.label }}</label>
                    <div class="input-wrapper">
                        <input 
                            type="number"
                            :id="item.id"
                            v-model.number="item.value"
                        />
                        <span class="unit">{{ item.unit }}</span>
                    </div>
                </template>
            </div>
            <div class="form-group" v-if="currentUser">
                <button @click="saveMeasurements" class="save-btn">
                    {{ isSaving ? 'Wird gespeichert...' : 'Masse speichern' }}
                </button>
            </div>
            <div v-else class="login-hint">
                <p><em>Melde dich an, um deine Masse dauerhaft zu speichern.</em></p>
            </div>
        </div>
    </div>
</template>

<style>
    .form-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        max-width: 400px;
        margin-bottom: 20px;
    }

    .box-container {
        border: #ddd;
        padding: 12px;

    }

    .form-group {
        display: grid;
        grid-template-columns: 180px 1fr;
        align-items: center;
        gap: 16px;
    }

    .radio-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .radio-label {
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-weight: normal;
    }

    .measurements-container {
        display: grid;
        grid-template-columns: 180px 200px;
        gap: 10px 16px;
        align-items: center;
        max-width: 400px;
    }

    .measurement-label {
        text-align: left;
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .input-wrapper input {
        width: 100px;
    }

    .divider {
        margin: 20px 0;
        border: 0;
        border-top: 1px solid #ddd;
        max-width: 400px;
    }
</style>