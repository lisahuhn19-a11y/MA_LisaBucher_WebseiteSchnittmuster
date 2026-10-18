<script setup>

import {ref, computed, onMounted, watch} from 'vue'
import {auth, db} from '@/firebase'
import {doc, getDoc, setDoc} from 'firebase/firestore'
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
const activeFrames = ref([])
const activeMeasurementId = ref(null)

const sizeChart = {
    S: {KoeH:168, BrU:84, uBrU:74, TaU:68, HueU:94, HaU:35.4, HlB:6.4, AlT:19.7, gRueL: 41.4, HueT: 21, gBrT:27.3, gVL: 44.7, oRueB: 17.2, gRueB: 16, gArD: 8.6, gBrB: 17.4, BrPA: 8.4, SuB: 12.1, SuWi: 20, ArL: 59.8, OaU: 26.8, HagU: 15.4, sTaA: 106, OsU: 53.8, SiH: 25.7, SrH: 80.3, FeU: 24, vTaA: 42.9, hTaA: 40.9, sTaH: 102, RueL: 41.4, BrT: 27.3, KnU: 35.5, uKnU: 31.5, WaU: 34.5, RiU: 20},
    M: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, gRueL: 41.6, HueT: 21, gBrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5, vTaA: 43.5, hTaA: 41.5, sTaH: 103, RueL: 41.6, BrT: 28.1, KnU: 37, uKnU: 33, WaU: 36, RiU: 22},
    L: {KoeH:168, BrU:92, uBrU:80, TaU:76, HueU:100, HaU:36.6, HlB:6.6, AlT:20.5, gRueL: 41.8, HueT: 21, gBrT:28.9, gVL: 45.9, oRueB: 18.2, gRueB: 17, gArD: 10, gBrB: 19, BrPA: 9.2, SuB: 12.4, SuWi: 20, ArL: 60.2, OaU: 29.2, HagU: 16.2, sTaA: 106, OsU: 57.4, SiH: 26.5, SrH: 79.5, FeU: 25, vTaA: 44.1, hTaA: 42.1, sTaH: 104, RueL: 41.8, BrT: 28.9, KnU: 38.5, uKnU: 34.5, WaU: 37.5, RiU: 24},
    XL: {KoeH:168, BrU:96, uBrU:84, TaU:80, HueU:103, HaU:37.2, HlB:6.7, AlT:20.9, gRueL: 42, HueT: 21, gBrT:29.7, gVL: 46.5, oRueB: 18.7, gRueB: 17.5, gArD: 10.7, gBrB: 19.8, BrPA: 9.6, SuB: 12.6, SuWi: 20, ArL: 60.4, OaU: 30.4, HagU: 16.6, sTaA: 106, OsU: 59.2, SiH: 26.9, SrH: 79.1, FeU: 25.5, vTaA: 44.7, hTaA: 42.7, sTaH: 105, RueL: 42, BrT: 29.7, KnU: 40, uKnU: 36, WaU: 39, RiU: 26}
}

const measurements = ref([
    {id: 'KoeH', label: 'Körperhöhe', frames: ['front'], value: sizeChart.M.KoeH, unit: 'cm', tags:['top', 'shirt']},
    {id: 'BrU', label: 'Brustumfang', frames: ['front'], value: sizeChart.M.BrU, unit: 'cm', tags:['top', 'shirt']},
    {id: 'TaU', label: 'Taillenumfang waagerecht', frames: ['front'], value: sizeChart.M.TaU, unit: 'cm', tags:['rock', 'top', 'hose', 'shirt']},
    {id: 'HueU', label: 'Hüftumfang', frames: ['front'], value: sizeChart.M.HueU, unit: 'cm', tags:['rock', 'top', 'hose', 'shirt']},
    //{id: 'nTaU', label: 'natürlicher Taillenumfang', frames: ['front'], value: sizeChart.M.nTaU, unit: 'cm', tags:[]},
    {id: 'vTaA', label: 'vorderer Taillenabstand', frames: ['side'], value: sizeChart.M.vTaA, unit: 'cm', tags:['rock']},
    {id: 'sTaA', label: 'seitlicher Taillenabstand', frames: ['side'], value: sizeChart.M.sTaA, unit: 'cm', tags:['rock']},
    {id: 'hTaA', label: 'hinterer Taillenabstand', frames: ['side'], value: sizeChart.M.hTaA, unit: 'cm', tags:['rock']},
    //{id: 'vTaH', label: 'vordere Taillenhöhe', frames: ['side'], value: sizeChart.M.vTaH, unit:'cm', tags:[]},
    //{id: 'hTaH', label: 'hintere Taillenhöhe', frames: ['side'], value: sizeChart.M.hTaH, unit: 'cm', tags:[]},
    {id: 'sTaH', label: 'seitliche Taillenhöhe', frames: ['front'], value: sizeChart.M.sTaH, unit: 'cm', tags:['hose']},
    //{id: 'HaU', label: 'Halsansatzumfang', frames: ['front'], value: sizeChart.M.HaU, unit: 'cm', tags:[]},
    {id: 'gRueL', label: 'Rückenlänge', frames: ['side'], value: sizeChart.M.gRueL, unit: 'cm', tags:['top', 'shirt']},
    {id: 'gBrT', label: 'Brusttiefe', frames: ['side'], value: sizeChart.M.gBrT, unit: 'cm', tags:['top', 'shirt']},
    {id: 'gVL', label: 'Vorderlänge', frames: ['side'], value: sizeChart.M.gVL, unit: 'cm', tags:['top', 'shirt']},
    {id: 'oRueB', label: 'obere Rückenbreite', frames: ['back'], value: sizeChart.M.oRueB, unit: 'cm', tags:[]},
    {id: 'AlT', label: 'Armlochtiefe', frames: ['side'], value: sizeChart.M.AlT, unit: 'cm', tags:['top', 'shirt']},
    {id: 'gRueB', label: 'gemessene Rückenbreite', frames: ['back'], value: sizeChart.M.gRueB, unit: 'cm', tags:['top']},
    //{id: 'gArD', label: 'Armdurchmesser', frames: ['arm'], value: sizeChart.M.gArD, unit: 'cm', tags:['top', 'rock']},
    {id: 'gBrB', label: 'Brustbreite', frames: ['front'], value: sizeChart.M.gBrB, unit: 'cm', tags:['top']},
    {id: 'BrPA', label: 'Brustpunktabstand', frames: ['front'], value: sizeChart.M.BrPA, unit: 'cm', tags:['shirt']},
    //{id: 'oBrB', label: 'obere Brustbreite', frames: ['front'], value: sizeChart.M.oBrB, unit: 'cm', tags:[]},
    //{id: 'oBrA', label: 'Oberbrustabstand', frames: ['side'], value: sizeChart.M.oBrA, unit: 'cm', tags:[]},
    //{id: 'uBrU', label: 'Unterbrustumfang', frames: ['front'], value: sizeChart.M.uBrU, unit: 'cm', tags:[]},
    //{id: 'uBrA', label: 'Unterbrustabstand', frames: ['side'], value: sizeChart.M.uBrA, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuB', label: 'Schulterbreite', frames: ['front'], value: sizeChart.M.SuB, unit: 'cm', tags:['top', 'shirt']},
    //{id: 'ArL', label: 'Armlänge', frames: ['arm'], value: sizeChart.M.ArL, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'OaU', label: 'Oberarmumfang', frames: ['arm'], value: sizeChart.M.OaU, unit: 'cm', tags:['shirt']},
    {id: 'HagU', label: 'Handgelenkumfang', frames: ['front'], value: sizeChart.M.HagU, unit: 'cm', tags:['shirt']},
    //{id: 'HanU', label: 'Handumfang', frames: ['front'], value: sizeChart.M.HanU, unit: 'cm', tags:['top', 'hose', 'rock']},
    //{id: 'AraU', label: 'Armansatzumfang', frames: ['side'], value: sizeChart.M.AraU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuWi', label: 'Schulterwinkel', frames: ['front'], value: sizeChart.M.SuWi, unit: '°', tags:['top', 'shirt']},
    //{id: 'SuH', label: 'Schulterhöhe', frames: ['front'], value: sizeChart.M.SuH, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'HueT', label: 'Hüfttiefe', frames: ['front'], value: sizeChart.M.HueT, unit: 'cm', tags:['rock', 'top', 'shirt']},
    {id: 'SiH', label: 'Sitzhöhe', frames: ['leg'], value: sizeChart.M.SiH, unit: 'cm', tags:['hose']},
    {id: 'SrH', label: 'Schritthöhe', frames: ['front'], value: sizeChart.M.SrH, unit: 'cm', tags:['hose']},
    {id: 'OsU', label: 'Oberschenkelumfang', frames: ['leg'], value: sizeChart.M.OsU, unit: 'cm', tags:['hose']},
    {id: 'KnU', label: 'Knieumfang', frames: ['leg'], value: sizeChart.M.KnU, unit: 'cm', tags:['hose']},
    {id: 'uKnU', label: 'Unterknieumfang', frames: ['leg'], value: sizeChart.M.uKnU, unit: 'cm', tags:['hose']},
    {id: 'WaU', label: 'Wadenumfang', frames: ['leg'], value: sizeChart.M.WaU, unit: 'cm', tags:['hose']},
    {id: 'FeU', label: 'Fesselumfang', frames: ['leg'], value: sizeChart.M.FeU, unit: 'cm', tags:['hose']},
    {id: 'RiU', label: 'Ristumfang', frames: ['leg'], value: sizeChart.M.RiU, unit: 'cm', tags:['hose']}
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

function handleFocus(item){
    activeMeasurementId.value = item.id
    activeFrames.value = item.frames || []
}

function handleBlur() {
    activeMeasurementId.value = null
    activeFrames.value = []
}

const relevantMeasurements = computed(() => {
    if (viewMode.value === 'all') {
        return measurements.value
    }
    return measurements.value.filter(m => m.tags.includes(selectedCloth.value))
})
</script>

<template>
    <h1>Variante 2</h1>

    <div v-if="isLoading">
        <p>Seite ist am laden...</p>
    </div>

    <div v-else-if="!currentUser">
        <p>Du bist noch nicht angemeldet. Melde dich <RouterLink to="/login">hier</RouterLink> an, um deine Masse später zu speichern!</p>
    </div>

    <div v-else>
        <h2>Wichtiges zum Messen</h2>
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
        <div class="view-container">
            <div class="sidebar-left">
                <div class="controls">
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
                        <label for="cloth-select">Kleidungsstück:</label>
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

                    <div class="form-group">
                        <button @click="saveMeasurements" class="save-btn" :disabled="isSaving">
                            {{ isSaving? 'Wird gespeichert...' :'Masse ' }}
                        </button>
                    </div>
                </div>

                <div class="silhouette-container">
                    <rect width="200" height="500" fill="white"/>
                    <!-- SVG für Vorne -->
                    <svg
                        v-show="activeFrames.includes('front')" 
                        viewBox="0 0 500 500" 
                        class="silhouette-svg"
                    >
                        <g id="front" fill="none" stroke="black" stroke-width="1">
                        <path id="Koerper1" d="M111 52.5C109.739 57.3383 105 61 100 61C95 61 89.5832 60.8957 86.5 50.5M125.5 77.75C125.5 77.75 123.317 90.1025 125.5 97.5C127.358 103.795 130.681 106.337 134 112C134 120.787 134 134.5 134 134.5C134 134.5 135.811 155.833 137 169.5C138.155 182.779 138.336 190.275 140 203.5C141.407 214.68 144.5 232 144.5 232C144.5 232 143.07 237.403 141.5 241.5C139.394 246.997 140 256.5 140 256.5C139.414 261.382 139.086 264.118 138.5 269C141.5 269.5 141.045 268.146 142.5 267C144 265 143.653 260.711 144.5 256.5C145.38 252.126 147.5 246 147.5 246C147.5 246 147.878 252.417 147.5 256.5C146.849 263.526 145.5 269 143 274C144.702 274.438 145.771 274.314 147.5 274C150.5 272 152.5 267.5 156 255C155.15 238 158.496 214.5 156 196.5C153.504 178.5 153.5 184.5 151 166.5C148.5 148.5 152.5 129 151 112C148.5 95 148 92.0366 142 84.5C134 80 122.81 76.1429 122.81 76.1429C122.81 76.1429 114.5 73.5 111 71C108.778 65.5 108.778 58 111 52.5C111 52.5 111.5 52.5 114.5 47C117.5 41.5 116.425 33.25 116.425 33.25M134 112C133.512 115.905 132.75 122 132.75 122M103 226C103 226 102.354 251.306 103 267.5C103.899 290.04 107 309 108.5 325C108.82 341.409 107.044 350.588 107 367C106.923 395.551 107 411.5 111 440C109.568 442.425 108.5 443.101 107 446C107.5 453 108.5 456.5 108.5 456.5C108.5 456.5 107 473 105 482.5C105.886 486.166 105.485 489.235 108.5 491.5C111.934 494.081 115.568 493.23 119.5 491.5C123.039 489.943 124.507 487.812 126.5 484.5C126 475.5 124.5 470 123 459C123.344 455.84 125 453.5 124.5 451C124 448.5 123 442 123 442C124.5 413.5 130 388.5 132 367C132 354 129.164 343.5 128.5 325C131 306 134 287.5 136 276C138.543 260.5 140 211.5 140 211.5L138.167 202.833M103 226H96.5M103 226C103 226 108.5 214 116 205.5C120.485 202.295 123.489 199.894 129 200C132.746 200.072 138.167 202.833 138.167 202.833M96.5 226C96.5 226 97.0878 251.304 96.5 267.5C95.6825 290.025 93 303 91.5 325C91.4644 341.431 93.7083 350.572 94 367C92 395.5 94 415.5 90 440C91.3995 443.01 92.5018 445.218 93 448.5C93.5404 452.06 92.2012 453.358 92 456.5C94 467.5 95 472.5 95.5 482.5C94.6143 486.166 94.9804 489.189 92 491.5C88.4507 494.252 84.594 493.346 80.5 491.5C76.9758 489.911 75.4802 487.82 73.5 484.5C76 472.5 77.5 459 77.5 459C77.5 459 76.0642 454.178 76 451C75.928 447.438 77.0212 445.531 77.5 442C73.5 411 72 395 68.5 367C68.4265 350.569 71.3934 341.426 71 325C68.5 304 66.9744 295.177 65 276C62.4126 250.868 60.8 247.5 60 211.5C60.6574 208.089 61.0964 206.187 62 202.833M96.5 226C96.5 226 91.5 216 82 205.5C77.7719 202.551 75.1503 199.778 70 200C66.6888 200.143 65.1242 201.727 62 202.833M72.25 77.75C72.25 77.75 73.6214 89.91 72.25 97.5C71.1905 103.364 67.5 112 67.5 112C67.5 112 67.8415 125.72 67.5 134.5C66.9661 148.226 65.4876 155.844 64 169.5C62.5522 182.791 61.8463 190.259 60 203.5C58.444 214.66 55.5 232 55.5 232C55.5 232 58.7258 237.598 60 241.5C61.8343 247.118 61.6459 250.601 62 256.5C62.2925 261.373 62 267 62 269C60.1517 269.123 59.0061 268.578 57.5 267.5C57.5 262 55.5 256.5 55.5 256.5L51.5 246C51.5 246 51.0124 252.429 51.5 256.5C52.3592 263.673 55.5 269 57.5 274C55.2835 274.76 53.7836 274.525 51.5 274C45 264 45.0848 262.793 42.5 255C45 229.5 41.5632 219.223 44 196.5C45.2632 184.721 47.2136 178.277 48.5 166.5C48 144.5 47.228 133.045 50.5 112C52 90.5 52 92.5 56.5 84.5C62.5 80.8171 72.25 77.75 72.25 77.75ZM67.5 112L68.5417 122M72.25 77.75L76 76.1429C76 76.1429 84.5426 74.7472 88 71C90.5 65 88.4128 56.7122 86.5 50.5L83.5 44.5C81.4202 40.586 82 39.5 82 33.25M82 33.25C81.4142 28.8566 79.7312 26.3651 80.5 22C82.1873 12.4196 90.2796 6.11776 100 6.5C109.269 6.8645 116.429 12.8574 118 22C118.751 26.3722 116.425 33.25 116.425 33.25M82 33.25C84.3431 29.4424 84.724 26.5424 88 23.5C91.6478 20.1123 94.5218 18 99.5 18C104.478 18 107.446 20.0139 111 23.5C114.111 26.5513 116.425 33.25 116.425 33.25M68.5417 122C68.5417 122 69.2192 130.559 70 136C71.5342 146.692 74.5 153 76 163C73.7768 171 68.9062 176.334 66 185.5C63.9003 192.122 63.0145 195.961 62 202.833M68.5417 122C68.5417 122 70.5938 126.58 73 128.5C77.4502 132.05 82.2292 132.151 87.5 130C90.4651 128.79 94 125 94 125M132.75 122C132.75 122 131.825 130.552 131 136C129.5 147 126.5 150 125.5 163C129.25 178 131.875 176.408 134.5 185.5C136.419 192.147 138.167 202.833 138.167 202.833M132.75 122C132.75 122 130 125 125.5 128.5C119 131.765 117.476 132.033 113 130C110.357 128.8 107.5 125 107.5 125M76.5 322C76.5 322 78.3212 324.35 80 325C81.821 325.705 83.4753 326.22 85 325C86.0228 324.182 86.5 322 86.5 322M113.5 322C113.5 322 113.5 324 115 325C117 326 119.5 325.5 120.5 325C122.102 324 123.167 323 124 322M52 169.5C52 169.5 53.825 171.125 55.5 171C57.0208 170.887 58.5 169.5 58.5 169.5M141.5 169.5C141.5 169.5 144 171.5 146 171C146.986 170.431 148 169.5 148 169.5M76 76.1429L80 95C80 95 83 102.5 99.5 102.5C116 102.5 117.5 95 117.5 95L122.81 76.1429" stroke="black"/>
                        </g>
                        <g fill="none">
                            <path v-show="activeMeasurementId === 'KoeH'" id="KoeH" d="M36 6V491" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'BrU'" id="BrU" d="M68.5 122H132.5" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'TaU'" id="TaU" d="M76 162.5H126" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'HueU'" id="HueU" d="M60 211.5H140" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'nTaU'" id="nTaU" d="M74.5 168C74.5 168 78 171 86.5 174C95 177 104.423 177.465 115 174C119.979 172.369 127 168 127 168" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'sTaH'" id="sTaH" d="M75.5 162.5C75.5 162.5 60 189 60 212C60 331.5 60 487 60 487" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'HaU'" id="HaU" d="M88.5 70.5C88.5 70.5 90.981 74.5575 93.5 76C97.5667 78.3289 101.538 78.5024 105.5 76C107.846 74.5181 110 70.5 110 70.5" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'uBrU'" id="uBrU" d="M69 133H132" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'SuB'" id="SuB" d="M56 84.5L88.5 71" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'HagU'" id="HagU" d="M145 232L155.5 234" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'HanU'" id="HanU" d="M140.5 245.5L156.5 252" stroke="#FF0000" stroke-width="2"/>
                            
                            <g v-show="activeMeasurementId === 'SuWi'" id="SuWi">
                                <path d="M88 70.5H69C69 70.5 67.7805 71.8965 67.5 73C67.2594 73.9462 67.2217 74.5642 67.5 75.5C67.9171 76.9026 70 78.291 70 78.291L88 70.5Z" fill="#FF8989"/>
                                <path d="M69 70.5H88L70 78.291M69 70.5H54.5V85L70 78.291M69 70.5C69 70.5 67.7805 71.8965 67.5 73C67.2594 73.9462 67.2217 74.5642 67.5 75.5C67.9171 76.9026 70 78.291 70 78.291" stroke="#FF0000" stroke-width="2"/>
                            </g>

                            <path v-show="activeMeasurementId === 'SuH'" id="SuH" d="M57.5 84C57.5 84 52.5 87.5 51.5 94.5C52.5 247 51.5 488 51.5 488" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'HueT'" id="HueT" d="M76.5 162.5C76.5 162.5 70.7801 173.24 68 180.5C65.0169 188.29 63.8236 192.86 62 201C61.0874 205.073 60 211.5 60 211.5" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'SrH'" id="SrH" d="M100 226.5V488" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'gBrT'" id="gBrT" d="M111 71C111 71 111.828 78.9339 112.5 84C114.484 98.9585 119.5 122 119.5 122" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'gVL'" id="gVL" d="M119.5 122.5L115 162.5" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'oBrB'" id="oBrB" d="M68.5 115C68.5 115 73.4817 111.304 77 109.5C93.5 105.5 106 106 123 109.5C127.482 111.225 134 115 134 115" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'AraU'" id="AraU" d="M142.5 85.5C142.5 85.5 139.091 89.2205 137.5 92C133.466 99.0489 134 112.5 134 112.5" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'gBrB'" id="gBrB" d="M69.5 122.5H133" stroke="#FF0000" stroke-width="2"/>
                            <path v-show="activeMeasurementId === 'BrPA'" id="BrPA" d="M80 122.5H120" stroke="#FF0000" stroke-width="2"/>
                        </g>
                    </svg>
                    <!-- SVG für Seite -->
                    <svg
                        v-show="activeFrames.includes('side')"
                        viewBox="0 0 500 500"
                        class="silhouette-svg"
                    >
                        <g id="side" fill="none" stroke="black" stroke-width="1">
                        <path id="Koerper2" d="M106.973 113C107 104 106.535 110.406 106.973 100M92.5 125.5C92.5 125.5 88.0814 129.636 84.5 130.5C81.8427 131.141 77.5 130.5 77.5 130.5M77.5 130.5C77.5 130.5 75.9585 130.186 75 130C71.5 128 70.9061 125.743 70 122C69.265 118.963 69.5022 117.084 70 114C78.1124 105.888 85.5393 99.1462 89.5 95.6297C91.398 93.9446 92.5 93 92.5 93C92.5 93 99.0492 85.6675 101.5 80C103.267 75.9131 105.127 73.4084 104.5 69C103.934 65.0193 99.5 60 99.5 60M90.25 20.25C90.25 20.25 88.7784 23.1007 88 25C85.7909 30.3901 85.0685 33.7026 84.5 39.5C84.0998 43.5809 84.5 50 84.5 50C84.5 50 84.5 58 88 62.5C89.6808 63.0131 92.5 62.5 92.5 62.5L99.5 60C99.5 60 105.004 58.0732 107.5 55.5C109.272 53.6724 111 50 111 50M120 50C120 50 125.305 44.1275 127 39.5C129.485 32.7162 129.666 27.7149 127 21C124.749 15.3303 122.454 11.7333 117 9C110.89 5.93783 105.533 5.78941 99.5 9C96.2068 10.7525 94.5339 12.3728 92.5 15.5C91.3809 17.2207 90.25 20.25 90.25 20.25M120 50C120 50 121.878 57.6971 123.5 62.5C127 75.5 131.65 75.9099 134 85.5C134.299 94.1568 134.795 99.0106 134.922 104M120 50L115.25 43.5M77.5 130.5C77.5 130.5 81.9761 152.332 82 166.5C82.0242 180.862 77.5 186 77.5 203C78.4079 209.998 82 220.5 82 220.5M82 220.5C82 220.5 85.1244 213.175 88.5 209.5C91.3271 206.423 92.9314 203.953 97 203C99.2617 202.47 102.948 203 102.948 203L113.5 209.5L120.5 216.5L125 230M82 220.5C82 220.5 80.5742 244.336 82 259.5C83.6419 276.962 87.6915 286.276 91 303.5C92.6111 311.887 93 314.5 95 325C96.9837 327.155 101 329.5 101 329.5M125 230C125 230 132.065 225.148 134.5 220.5C137.332 215.094 137.18 211.065 136.5 205C135.977 200.335 134.708 197.873 133 193.5C131.345 189.264 127.966 183 127.966 183C127.966 183 125.261 174.892 125 169.5C124.665 162.576 126.738 158.822 127.966 152C128.951 146.524 130.604 138 130.604 138C132.125 129.213 133.697 124.381 134.5 115.5C134.925 110.797 135.008 107.368 134.922 104M125 230C125 230 127.617 260.163 127 279.5C125 294 120.5 313 122.5 325C127 336.5 130.5 340 134.5 351.5C136.061 359.949 134.5 373.5 134.5 373.5C134.5 373.5 128.702 405.047 128 425.5C127.732 433.306 128 445.5 128 445.5L134.5 455C134.5 455 134.485 461.547 132.5 465C130.515 468.453 129.884 466.613 128 467C125.106 467.594 123.421 466.443 120.5 466C118.151 465.644 116.872 464.873 114.5 465C111.848 465.142 110.614 466.53 108 467C104.156 467.691 101.789 467.947 98 467C96.8019 466.7 95 466 95 466C95 466 90.2084 467.722 87 468C85.2492 468.152 83.9978 468.919 82.5 468L80.5 465C80.5 465 79.7572 462.374 80.5 461C80.5 461 83.4287 459.364 85.5 459C88.0075 458.559 89.4713 459.796 92 459.5C95.5655 459.083 97.3135 457.653 100.5 456C103.146 454.627 104.777 453.985 107 452C108.548 450.618 110.5 448 110.5 448C110.5 425.5 108.472 418.433 107 399.5C105.541 380.747 104.659 370.237 103 351.5C102.239 342.907 101 329.5 101 329.5M101 329.5C101 329.5 104.974 328.53 107 327C108.657 325.749 110.5 323 110.5 323M90.25 20.25C90.25 20.25 96.0801 19.0867 99.5 20.25C103.37 21.5663 104.596 24.1227 107.5 27C110.253 29.7282 111.691 31.3871 114 34.5M115.25 43.5L117 41.5C117 41.5 119.513 35.5768 117 34.5C115.923 34.0385 115.172 34.5 114 34.5C112.995 33.8972 112.005 33.8972 111 34.5C109.326 35.5046 111 39.5 111 39.5M113.5 45.5L115.25 43.5M89.5 95.6297L101.5 94.5C101.5 94.5 101.431 85.4442 104.5 81C106.787 77.6875 108.582 75.4221 112.5 74.5C115.968 73.6838 118.31 74.4126 121.5 76C127 81 127 81 129.5 85.5C131 95.6297 130.604 97.5 130.604 102.5C132.121 103.44 134.922 104 134.922 104M106.973 100C107.151 95.7864 107.356 91.1203 107.5 85.5C108.715 83.2627 108.884 81.4155 111 80C113.921 78.0458 116.747 78.6692 120 80C122.232 80.9131 123.431 82.3168 124.509 84M126.5 113C126.5 113 126.5 109.953 126.5 108C126.5 100.19 126.5 88 126.5 88L124.509 84C124.509 84 122.41 79.8813 120 78.5C117.436 77.0305 115.339 76.6812 112.5 77.5C110.21 78.1605 108.943 79.1031 107.5 81C105.779 83.2627 105.821 85.1751 105.5 88C105.28 89.9401 105.334 91.0545 105.5 93C105.738 95.7834 106.973 100 106.973 100" stroke="black"/>
                        </g>
                        
                        <g v-show="activeMeasurementId === 'vTaA'" id="vTaA">
                            <path id="Taillen" d="M125 168H82M125 171C125 171 116.428 171.981 111 173C104.483 174.223 101.038 175.897 94.5 177C89.2694 177.883 81 178.5 81 178.5" stroke="#FFAEAE"/>
                            <path id="vTaA" d="M82 168L81 178.5" stroke="#FF0000" stroke-width="2"/>
                        </g>
                        
                        <g v-show="activeMeasurementId === 'sTaA'" id="sTaA">
                            <path id="Taillen" d="M125 168H82M125 171C125 171 116.428 171.981 111 173C104.483 174.223 101.038 175.897 94.5 177C89.2694 177.883 81 178.5 81 178.5" stroke="#FFAEAE"/>
                            <path id="sTaA" d="M102.5 168V175.5" stroke="#FF0000" stroke-width="2"/>
                        </g>
                        
                        <g v-show="activeMeasurementId === 'hTaA'" id="hTaA">
                            <path id="Taillen" d="M125 168H82M125 171C125 171 116.428 171.981 111 173C104.483 174.223 101.038 175.897 94.5 177C89.2694 177.883 81 178.5 81 178.5" stroke="#FFAEAE"/>
                            <path id="hTaA" d="M125 168V171.5" stroke="#FF0000" stroke-width="2"/>
                        </g>
                        
                        <path v-show="activeMeasurementId === 'vTaH'" id="vTaH" d="M82 168.5C82 168.5 80.9722 178.886 80 185.5C79.1643 191.185 78.4263 194.329 77.5 200C77.5 307 77.5 468.5 77.5 468.5" fill="none" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'hTaH'" id="hTaH" d="M125.5 168C125.5 168 126.365 172.885 127 176C127.719 179.528 127.968 181.551 129 185C130.904 191.363 134.362 194.063 136 200.5C137.261 205.453 137.5 213.5 137.5 213.5V468" fill="none" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'gRueL'" id="gRueL" d="M125.5 68C125.5 68 132.278 78.1433 134.5 85.5C136.5 97.5 135.515 104.74 134.5 117C133.321 131.237 128 153 128 153L125 167.5" fill="none" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'gBrT'" id="gBrT" d="M125.5 68C125.5 68 115.719 68.6977 110 71C107.57 71.9782 104 74 104 74L70 113.5" fill="none" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'gVL'" id="gVL" d="M69.5 113.5L82 169" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'oBrB'" id="oBrB" d="M107 100C107 100 99.6383 101.152 95.5 100C92.5557 99.1801 86 98 86 98" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'oBrA'" id="oBrA" d="M87 98.5L70.5 114" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'uBrA'" id="uBrA" d="M70 114C70 114 68.7697 117.942 69 120.5C69.329 124.154 69.9443 126.97 73 129C74.543 130.025 77.5 130.5 77.5 130.5" fill="none" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'AraU'" id="AraU" d="M113 78C116.071 77.0293 118.307 78.234 121 80C124.306 82.1682 125.416 84.6978 126.5 88.5C127.517 92.0678 128 94 126.5 98C124.442 99.8413 122.261 98.9316 119.5 99C116.159 99.0828 114.09 99.2747 111 98C109.545 97.3996 108.606 97.1207 107.5 96C107.5 92 106.147 89.3709 107.5 85.5C108.698 82.0713 109.537 79.0948 113 78Z" fill="none" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'AlT'" id="AlT" d="M125 68.5C125 68.5 132.268 77.9076 134.5 85C136.274 90.6371 136.5 100 136.5 100" fill="none" stroke="#FF0000" stroke-width="2"/>
                    </svg>
                    <!-- SVG für Rücken -->
                    <svg
                        v-show="activeFrames.includes('back')"
                        viewBox="0 0 500 500"
                        class="silhouette-svg"
                    >
                        <g id="back" fill="none" stroke="black" stroke-width="1">
                        <path id="Koerper3" d="M44.5 190C44.5 190 44.2387 185.417 44.5 182.5C45.0624 176.222 47.8403 173.195 49 167C49 154.5 48.7662 148.409 49 136.5C49.3262 119.888 49 111.5 51 94C53.5047 89.3159 54.3144 85.5019 59 83C61.4928 81.669 66 81.1667 66 81.1667C66 81.1667 75.0553 80.2372 80 77.5C83.5218 75.5504 86.254 74.6271 88 71C88 66 88 60.5 88 60.5M66 81.1667C66 81.1667 68.6085 96.3477 67.5 106C67.1154 109.349 66 114.5 66 114.5C66 114.5 65.7464 128.069 67.5 136.5C69.1851 144.602 72.682 148.427 74.5 156.5C75.2405 159.788 76.2917 161.642 76 165C75.5843 169.785 72.4007 171.589 70.5 176C68.4468 180.765 66 188.5 66 188.5V190M66 114.5C66 114.5 66.4208 126.396 66 134C65.3241 146.214 61.5 165 61.5 165V190M132 114.5L129.5 136.5C129.5 136.5 126.811 148.702 125 156.5C124.229 159.822 122.899 161.591 123 165C123.138 169.639 125.83 171.67 127.5 176C129.367 180.841 132 188.5 132 188.5V190M131.875 81.625C131.875 81.625 129.5 94 129.5 106C130.137 109.401 132 114.5 132 114.5C132 114.5 131.579 126.396 132 134C132.676 146.214 135.176 152.839 136.5 165C137.56 174.737 138.5 190 138.5 190M131.875 81.625L127.25 80.25C127.25 80.25 121.344 79.2372 118 77.5C114.428 75.6444 111.746 74.6271 110 71C110 66.5 110 60.5 110 60.5M153.5 190C153.5 190 153.787 185.415 153.5 182.5C152 176 149.787 173.229 148.5 167C148.5 153 148.5 136.5 148.5 136.5C148.5 136.5 150.5 109 146 94C143.031 89.1624 141.664 85.3556 136.5 83C134.786 82.218 131.875 81.625 131.875 81.625M127.25 80.25C127.25 80.25 124.836 92.9347 123 101C121.213 108.85 121.5 115.5 118 121C117.4 121.207 116.713 121.329 116 121.393C113.204 121.645 110 121 110 121H88C88 121 82.9603 121.999 80 121C76 114.5 76.3724 108.881 74.5 101C72.6736 93.3126 70.5 81.1667 70.5 81.1667M90.5 102.5C90.5 102.5 91.3001 108.078 90.5 111.5C89.9222 113.972 89.6333 115.557 88 117.5C86.3619 119.449 82.5 121 82.5 121M108 102.5C108 102.5 107.075 108.109 108 111.5C108.689 114.027 109.327 115.484 111 117.5C112.581 119.404 116 121.393 116 121.393" stroke="black"/>
                        </g>
                        <path v-show="activeMeasurementId === 'oRueB'" id="oRueB" d="M67.5 106.5H130" stroke="#FF0000" stroke-width="2"/>
                        <g v-show="activeMeasurementId === 'AlT'">
                            <path id="Klebeband" d="M65.5 115.5H133" stroke="#FFAEAE"/>
                            <path id="AlT" d="M99.5 72.5V115.5" stroke="#FF0000" stroke-width="2"/>
                        </g>
                        <path v-show="activeMeasurementId === 'gRueB'" id="gRueB" d="M66.5 116H132" stroke="#FF0000" stroke-width="2"/>
                    </svg>
                    <!-- SVG für Arm -->
                    <svg
                        v-show="activeFrames.includes('arm')"
                        viewBox="0 0 500 500"
                        class="silhouette-svg"
                    >
                        <g id="arm" fill="none" stroke="black" stroke-width="1">
                        <path id="arm" d="M132.25 81L126.375 78.5C126.375 78.5 122.099 77.9132 120.5 76C120 72.5 120.5 67 120.5 67M160 207C160 207 160 184 160 168C159.097 163.447 157 156.5 157 156.5C157 156.5 157.371 145.215 157 138C156.125 120.976 155 112.5 149.5 95C147.612 91.3393 147.034 88.7859 144 86C140.327 82.6271 132.25 81 132.25 81M152.5 207C152.5 207 147.671 188.585 147 176.5C146.697 171.041 147 162.5 147 162.5C147 162.5 145.055 153.991 144 148.5C142.099 138.607 140.104 123 140.104 123M140.104 123C140.104 123 139.824 116.431 138.5 112.5C136.907 107.771 133.596 106.227 132 101.5C129.5 86 132.25 81 132.25 81M144 207C144 207 144.479 201.785 144 198.5C143.243 193.309 139.082 186 139.082 186C139.082 186 133.048 175.481 132 168C131.377 163.552 131.734 160.983 132 156.5C132.796 143.064 140.104 123 140.104 123M81.5 81.5769C81.5 81.5769 74.2835 83.8081 70 86C52.5 107 38.5 143.5 38.5 143.5C38.5 143.5 34.8734 148.023 34 151.5C34.5 160.5 38.5 168 38.5 168L52.5 198.5L57.5 203.5H66L70 207C70 207 69.3873 201.762 70 198.5C70.5777 195.424 72.8279 191 72.8279 191L74.7131 186C74.7131 186 80.4931 175.445 81.5 168C82.1019 163.549 81.7891 160.982 81.5 156.5C80.7105 144.26 74 126 74 126C74 126 74 117.772 74 112.5M81.5 81.5769C81.5 81.5769 84 86 81.5 101.5C79.6661 106.365 76.9289 108.204 74 112.5C69.8995 118.944 63.5 129 63.5 129L49.5 151.5L57.5 181L60.5 194L72.8279 191M81.5 81.5769L87 79.4615C87 79.4615 93.9422 79.1537 96 76C96 70.5 96 67 96 67M126.375 78.5L122.5 101.5H91L87 79.4615M74.7131 186C74.7131 186 83.4045 191.841 87.5 197C90.3316 200.567 93.5 207 93.5 207M120 207C120 207 121.186 198.229 124.5 194C128.506 188.887 139.082 186 139.082 186" stroke="black"/>
                        </g>
                        <path v-show="activeMeasurementId === 'ArL'" id="ArL" d="M69 86.5C69 86.5 49 116 38.5 143C36.7494 146.128 34.8994 147.53 34 151C36 163.5 38.5 168 38.5 168L52.5 201" fill="none" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'OaU'" id="OaU" d="M69 119.5L54 109" stroke="#FF0000" stroke-width="2"/>
                    </svg>
                    <!-- SVG für Bein -->
                    <svg 
                        v-show="activeFrames.includes('leg')"
                        viewBox="0 0 500 500"
                        class="silhouette-svg"
                    >
                        <g id="leg" fill="none" stroke="black" stroke-width="1">
                        <path id="Koerper5" d="M61.5 39C61.5 39 58.7542 52.4078 57 61C54.8474 71.5432 51.9128 77.2472 51.5 88C51.207 95.6321 48.5292 101.308 53 107.5C56.2349 111.981 65 115 65 115M65 115H48V217.5H119V115H88.5M65 115H74.5M88.5 115C88.5 115 111.841 114.593 126.5 112C135.594 110.392 149.5 106.5 149.5 106.5H155C155 106.5 153.791 117.768 154 125C155 137 159 155 159 155C159 155 160.5 166.5 160 174.5C159.154 178.362 156.5 184 156.5 184C156.5 184 153 188 151 191C150.892 193.036 151.486 194.232 152.5 196C154.307 199.15 157.525 198.842 160 201.5C162.51 204.196 165 209.5 165 209.5C165 209.5 167.5 214.5 168.5 217.5C170.172 218.666 171.475 218.762 173.5 219C176.848 219.393 182 217.5 182 217.5C182 217.5 184.983 216.5 184 213.5C183 212.5 181 212.5 178.5 212.5C176.5 212.5 176.406 210.229 175.5 208.5C174.5 203.5 175.908 199.648 175.5 194C175.174 189.483 174.231 187.023 174 182.5C173.621 175.067 174.857 170.915 175.5 163.5C176.211 155.293 176.667 150.696 177.5 142.5C178.414 133.511 179.631 128.527 180 119.5C180.223 114.037 179.493 110.944 180 105.5C180.348 101.76 181.832 99.7413 181.5 96C180.999 90.3461 178.896 87.1274 175 83C168.5 77.5 157.432 78.9804 146 77.5C130.206 75.4546 106.856 75.7607 99.1057 75.9325M88.5 115H74.5M94.5 40.5C94.5 40.5 93.9879 48.7528 94.5 54C95.0617 59.7552 97.611 62.7185 97.5 68.5C97.4433 71.4543 96.5 76 96.5 76C96.5 76 97.4446 75.9694 99.1057 75.9325M99.1057 75.9325C99.1057 75.9325 89.9674 77.5249 85 80.5C80.142 83.4095 77.9503 86.0099 74.5 90.5C71.3567 94.5905 67.9873 96.8413 68 102C68.007 104.843 68.7425 106.45 70 109C71.2954 111.627 74.5 115 74.5 115" stroke="black"/>
                        </g>
                        
                        <g v-show="activeMeasurementId === 'SiH'" id="SiH">
                            <path id="Taille" d="M94.5 53.5H59.5" stroke="#FFAEAE"/>
                            <path id="SiH" d="M81 54.5V114" stroke="#FF0000" stroke-width="2"/>
                        </g>
                        
                        <path v-show="activeMeasurementId === 'OsU'" id="OsU" d="M111 76L116.5 113" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'KnU'" id="KnU" d="M155 106.5L178.5 87" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'uKnU'" id="uKnU" d="M155 109L180 106.5" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'WaU'" id="WaU" d="M154.5 126H179.5" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'FeU'" id="FeU" d="M174 177.5L159.5 174.5" stroke="#FF0000" stroke-width="2"/>
                        <path v-show="activeMeasurementId === 'RiU'" id="RiU" d="M151 190.5L176 193.5" stroke="#FF0000" stroke-width="2"/>
                    </svg>
                </div>
            </div>

            <!-- Eingabe Formular -->
            <div class="form-container">
                <div v-for="item in relevantMeasurements" :key="item.id" class="measurement-row">
                    <label :for="item.id">{{ item.label }}</label>
                    <input 
                        type="number" 
                        :id="item.id" 
                        v-model.number="item.value"
                        @focus="handleFocus(item)"
                        @blur="handleBlur"
                    />
                    <span>{{ item.unit }}</span>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
.view-container {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 40px;
    padding: 20px;
    height: 100vh;
    box-sizing: border-box;
}

.sidebar-left {
    position: sticky;
    top: 20px; 
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-shrink: 0;
}

.controls {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    flex-grow: 1;            
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    padding-right: 10px;
}

.measurement-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.measurement-row label {
    flex: 1;
}

.measurement-row input {
    width: 80px;
    padding: 5px;
}

.silhouette-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    height: 400px;
    margin: 0 auto;
}

.silhouette-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>