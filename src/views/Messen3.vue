<!-- src/views/StartseiteView.vue -->
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { auth, db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const currentUser = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const isSaved = ref(false)
const setupStep = ref(1)

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

        setupStep.value = 4

    } catch (error) {
        console.error('Fehler beim Speichern:', error)
    } finally {
        isSaving.value = false
    }
}

const viewModes = [
    { id: 'all', name: 'Alle Masse' },
    { id: 'specific', name: 'Nur für spezifisches Kleidungsstück' }
]

const viewMode = ref('all')

const clothes = ref([
    { id: 'rock', name: 'Rock' },
    { id: 'top', name: 'Top' },
    { id: 'hose', name: 'Hose' },
    { id: 'shirt', name: 'Shirt' }
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
    {id: 'KoeH', label: 'Körperhöhe', value: null, unit: 'cm', tags:['top', 'shirt'], instruction: 'Die Körperhöhe wird von der Schädeldecke bis zur Fusssohle gemessen, das heisst ohne Schuhe und ohne voluminöse Kopfbehaarung.'},
    {id: 'BrU', label: 'Brustumfang', value: null, unit: 'cm', tags:['top', 'shirt'], instruction: 'Das Massband wird waagrecht über die Brustpunkte gelegt, unter den Armen hindurchgeführt und etwas über den unteren Ansatz der Schulterblätter angehoben.'},
    {id: 'TaU', label: 'Taillenumfang waagerecht', value: null, unit: 'cm', tags: ['rock', 'top', 'hose', 'shirt'], instruction: 'Das Massband wird knapp unterhalb der schmalsten Stelle des Körpers umgelegt. Es liegt seitlich an der engsten Stelle des Körpers und möglichst waagerecht zum Boden.'},
    {id: 'nTaU', label: 'natürlicher Taillenumfang', value: null, unit: 'cm', tags:['rock'], instruction: 'Das Massband wird oberhalb des Gesässes angelegt und dort durchgeführt, wo normalerweise der Hosenbund getragen wird'},
    {id: 'HueU', label: 'Hüftumfang', value: null, unit: 'cm', tags:['rock', 'top', 'hose', 'shirt'], instruction: 'Das Massband wird um die breiteste Stelle des Gesässes gelegt. Bewege das Massband etwas nach oben und unten, um sicherzugehen, dass du die breiteste Stelle erwischt hast.'},
    {id: 'vTaA', label: 'vorderer Taillenabstand', value: null, unit: 'cm', tags:['rock'], instruction: 'Miss den vorderen Abstand zwischen der waagerechten Taille und der natürliche Taille'},
    {id: 'sTaA', label: 'seitlicher Taillenabstand', value: null, unit: 'cm', tags:['rock'], instruction: 'Miss den seitlichen Abstand zwischen der waagerechten Taille und der natürliche Taille'},
    {id: 'hTaA', label: 'hinterer Taillenabstand', value: null, unit: 'cm', tags: ['rock'], instruction: 'Miss den hinteren Abstand zwischen der waagerechten Taille und der natürliche Taille'},
    {id: 'sTaH', label: 'seitliche Taillenhöhe', value: null, unit: 'cm', tags: ['hose'], instruction: 'Auf einer Seite des Körpers wird der Abstand zwischen der Taille und dem Boden gemessen'},
    {id: 'gRueL', label: 'Rückenlänge', value: null, unit: 'cm', tags:['top', 'shirt'], instruction: 'vom 7. Halswirbel wird entlang der Wirbelsäule bis zur Taille gemessen'},
    {id: 'gBrT', label: 'Brusttiefe', value: null, unit: 'cm', tags:['top', 'shirt'], instruction: 'vom 7. Halswirbel wird eng um den Hals bis zum Brustpunkt gemessen'},
    {id: 'gVL', label: 'Vorderlänge', value: null, unit: 'cm', tags:['top', 'shirt'], instruction: 'vom 7. Halswirbel wird entlang des Halses über den Brustpunkt bis zur Taille gemessen'},
    {id: 'oRueB', label: 'obere Rückenbreite', value: null, unit: 'cm', tags:[], instruction: 'Miss den Abstand zwischen den Armansatzfalten über die Schulterblätter'},
    {id: 'gRueB', label: 'gemessene Rückenbreite', value: null, unit: 'cm', tags:['top'], instruction: 'Führe das Massband unter den Armansätzen durch und miss den Abstand zwischen der Hinterseiten der Arme'},
    {id: 'AlT', label: 'Armlochtiefe', value: null, unit: 'cm', tags:['top', 'shirt'], instruction: 'vom 7. Halswirbel entlang der Wirbelsäule bis zur Höhe der gemessenen Rückenbreite messen'},
    {id: 'gBrB', label: 'Brustbreite', value: null, unit: 'cm', tags:['top'], instruction: 'Führe das Massband über die Brustpunkte bis unter die Armansätze. Miss die Strecke zwischen den beiden vorderen Armansätzen'},
    {id: 'BrPA', label: 'Brustpunktabstand', value: null, unit: 'cm', tags:['shirt'], instruction: 'Miss zwischen den beiden Brustpunkten'},
    {id: 'SuB', label: 'Schulterbreite', value: null, unit: 'cm', tags:['top', 'shirt'], instruction: 'Miss zwischen dem höchsten Punkt der Schulter (bei der Halslochnaht) bis zum äussersten seitlichen Punkt der Schulter'},
    {id: 'SuWi', label: 'Schulterwinkel', value: null, unit: '°', tags:['top', 'shirt'], instruction: 'Miss mit einem Geodreieck den Winkel zwischen der Horizontalen und der Schulterbreite'},
    {id: 'OaU', label: 'Oberarmumfang', value: null, unit: 'cm', tags:['shirt'], instruction: 'Miss beim natürlich herabhängenden Arm den Umfang an der stärkste Stelle unterhalb der Achselhöhle'},
    {id: 'HagU', label: 'Handgelenkumfang', value: null, unit: 'cm', tags:['shirt'], instruction: 'Miss den Umfang über die stärkste Stelle des Handgelenk-Knöchel'},
    {id: 'HueT', label: 'Hüfttiefe', value: null, unit: 'cm', tags:['rock', 'top', 'shirt'], instruction: 'Miss den Abstand zwischen der Taille und dem Hüftumfang an der Seite des Körpers'},
    {id: 'SiH', label: 'Sitzhöhe', value: null, unit: 'cm', tags:['hose'], instruction: 'Setze dich auf eine ebene Fläche und miss den Abstand zwischen der Taille und der Sitzfläche'},
    {id: 'SrH', label: 'Schritthöhe', value: null, unit: 'cm', tags:['hose'], instruction: 'Miss den Abstand zwischen Schritt und Boden'},
    {id: 'OsU', label: 'Oberschenkelumfang', value: null, unit: 'cm', tags:['hose'], instruction: 'Miss den Umfang an der stärksten Stelle des Oberschenkels'},
    {id: 'KnU', label: 'Knieumfang', value: null, unit: 'cm', tags:['hose'], instruction: 'Miss den Umfang über die stärkste Stelle des Knies'},
    {id: 'uKnU', label: 'Unterknieumfang', value: null, unit: 'cm', tags:['hose'], instruction: 'Miss den Umfang an der engsten Stelle unter dem Knie'},
    {id: 'WaU', label: 'Wadenumfang', value: null, unit: 'cm', tags:['hose'], instruction: 'Miss den Umfang über die stärkste Stelle der Wade'},
    {id: 'FeU', label: 'Fesselumfang', value: null, unit: 'cm', tags:['hose'], instruction: 'Miss den Umfang über die stärkste Stelle der Fussknöchel'},
    {id: 'RiU', label: 'Ristumfang', value: null, unit: 'cm', tags:['hose'], instruction: 'Miss den Umfang unter der Ferse und über den Rist bei gestrecktem Fuss'}
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

const currentStepIndex = ref(0)

const currentMeasurement = computed(() => {
    return relevantMeasurements.value[currentStepIndex.value] || null
})

const totalSteps = computed(() => relevantMeasurements.value.length)

const progressPercentage = computed(() => {
    if (totalSteps.value === 0) return 0
    return ((currentStepIndex.value + 1) / totalSteps.value) * 100
})

function goToSetup() {
    setupStep.value = 2
}

function startWizard() {
    setupStep.value = 3
    currentStepIndex.value = 0
}

function nextStep() {
    if (currentStepIndex.value < totalSteps.value - 1) {
        currentStepIndex.value++
    }
}

function prevStep() {
    if (currentStepIndex.value > 0) {
        currentStepIndex.value--
    }
}

function backToSetup() {
    setupStep.value = 2
    currentStepIndex.value = 0
}

function backToInstructions() {
    setupStep.value = 1
}
</script>

<template>
    <h1>Messen 3</h1>

    <div v-if="isLoading">
        <p>Seite ist am Laden...</p>
    </div>

    <div v-else-if="!currentUser">
        <p>Du bist noch nicht angemeldet. Melde dich <RouterLink to="/login">hier</RouterLink> an, um deine Masse später zu speichern!</p>
    </div>

    <div v-else>
        <div>
            <!-- SCHRITT 1: Anleitungen & Vorbereitung -->
            <div v-if="setupStep === 1" class="full-width-screen">

                <p v-if="!currentUser">Du bist noch nicht angemeldet. Melde dich <RouterLink to="/login">hier</RouterLink> an, um deine Masse später zu speichern!</p>

                <div class="form-container">
                    <div class="info-section">
                        <h2>Wichtiges zum Messen</h2>
        <ul>
            <li>Suche eine Person, die dir beim Messen hilft. Besonders für die Rückenmasse ist es schwierig sich selbst zu messen.</li>
            <li>Trage eng anliegende Kleidung oder Unterwäsche, damit deine Körperform gut sichtbar ist.</li>
            <li>Benutze ein flexibles Massband.</li>
            <li>Halte ein Geodreieck bereit.</li>
            <li>Halte Klebeband, Schnur oder Kajalstift bereit, um gewisse Punkte am Körper zu markieren.</li>
            <li>Messe dich am besten vor einem Spiegel, damit du gut siehts wo das Messband liegt.</li>
            <li>Achte beim Vermessen auf eine aufrechte Haltung.</li>
            <li>Achte darauf, dass das Massband deinen Körper berührt, jedoch nicht einschneidet. (nicht schummeln ;-)</li>
        </ul>
        <h2>vor dem Messen</h2>
        <ul>
            <li>Markiere deine Taille (die schmalste Stelle zwischen unterem Rippenbogen und Beckenkamm), indem du eine Schnur oder ähnliches herumbindest.</li>
            <li>Markiere den 7. Halswirbel mit einem Stück Klebeband oder Kajalstift. Der 7. 
                Halswirbel ertastest du, indem du den Kopf leicht nach vorne neigst. Der Knochen, der 
                jetzt am stärksten im Nacken hervorsteht ist dein 7. Halswirbel.</li>
        </ul>
                    </div>
                    
                    <button @click="goToSetup" class="primary-btn full-width">Weiter zur Auswahl</button>
                </div>
            </div>

            <!-- SCHRITT 2 & 3 -->
            <div v-else-if="setupStep === 2 || setupStep === 3" class="container">

                <!-- SCHRITT 2: Einstellungen -->
                <div v-if="setupStep === 2" class="setup-screen">
                    <button @click="backToInstructions" class="back-link">← Zurück zur Anleitung</button>

                    <div class="measurement-step-card">
                        <h2>Einstellungen für die Messung</h2>
                        
                        <div class="form-container">
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
                        </div>

                        <div class="card-footer">
                            <button @click="startWizard" class="primary-btn">Messung starten</button>
                        </div>
                    </div>
                </div>

                <!-- SCHRITT 3: Einzelanzeige der Maße (Wizard) -->
                <div v-else-if="setupStep === 3" class="wizard-screen">
                    <button @click="backToSetup" class="back-link">← Zurück zur Auswahl</button>

                    <div v-if="currentMeasurement" class="measurement-step-card">
                        <h2>{{ currentMeasurement.label }}</h2>
                        <p class="instruction-placeholder">{{ currentMeasurement.instruction }}</p>

                        <div class="input-wrapper large">
                            <input 
                                type="number"
                                :id="currentMeasurement.id"
                                v-model.number="currentMeasurement.value"
                                autofocus
                            />
                            <span class="unit">{{ currentMeasurement.unit }}</span>
                        </div>

                        <div class="wizard-nav-buttons">
                            <button @click="prevStep" :disabled="currentStepIndex === 0" class="secondary-btn">Zurück</button>
                            
                            <button v-if="currentStepIndex < totalSteps - 1" @click="nextStep" class="primary-btn">Weiter</button>
                            
                            <div v-else class="save-section">
                                <div v-if="currentUser" class="form-group">
                                    <button @click="saveMeasurements" class="save-btn">
                                        {{ isSaving ? 'Wird gespeichert...' : 'Masse speichern' }}
                                    </button>
                                </div>
                                <div v-else class="login-hint">
                                    <p><em>Melde dich an, um deine Masse dauerhaft zu speichern.</em></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Fortschrittsbalken -->
                    <div class="progress-container">
                        <div class="progress-bar-background">
                            <div class="progress-bar-fill" :style="{ width: progressPercentage + '%' }"></div>
                        </div>
                        <span class="progress-text">{{ currentStepIndex + 1 }}/{{ totalSteps }}</span>
                    </div>
                </div>
            </div>

            <!-- SCHRITT 4: Erfolgsmeldung -->
            <div v-if="setupStep === 4" class="full-width-screen">
                <p>Deine Masse wurden erfolgreich gespeichert. <RouterLink to="/schnittmuster">Hier</RouterLink> geht es weiter zu den Schnittmustern.</p>
            </div>
        </div>
    </div>

</template>

<style scoped>
    /* Standard-Container für Schritt 2 & 3 (schmal, 500px und zentriert) */
    .container {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        box-sizing: border-box;
    }

    /* Schritt 1 & 4: Gehen über den gesamten Bildschirm */
    .full-width-screen {
        width: 100%;
        padding: 20px 40px;
        box-sizing: border-box;
        text-align: center;
    }

    .full-width-screen h1 {
        text-align: center;
        width: 100%;
        margin-bottom: 30px;
    }

    .full-width-screen .form-container {
        max-width: 900px;
        margin: 0 auto;
        text-align: left;
    }

    .info-section {
        margin-bottom: 20px;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 20px;
    }

    .form-group {
        display: grid;
        grid-template-columns: 140px 1fr;
        align-items: center;
        gap: 16px;
        width: 100%;
    }

    .form-group select {
        width: 100%;
        padding: 6px;
        box-sizing: border-box;
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

    .measurement-step-card {
        background: #f9f9f9;
        border: 1px solid #e0e0e0;
        padding: 24px;
        border-radius: 8px;
        margin-bottom: 20px;
    }

    .card-footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
    }

    .instruction-placeholder {
        background: #deccef;
        border-left: 4px solid #340064;
        padding: 10px;
        margin: 16px 0;
        color: #000000;
    }

    .input-wrapper.large {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 20px 0;
    }

    .input-wrapper.large input {
        width: 120px;
        font-size: 1.2rem;
        padding: 6px;
    }

    .wizard-nav-buttons {
        display: flex;
        gap: 10px;
        justify-content: space-between;
        margin-top: 20px;
    }

    .primary-btn, .secondary-btn, .save-btn {
        padding: 8px 16px;
        cursor: pointer;
    }

    .full-width {
        width: 100%;
    }

    .back-link {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        margin-bottom: 15px;
        font-size: 0.95rem;
    }

    /* Fortschrittsbalken direkt unter dem Kasten */
    .progress-container {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        background: transparent;
        padding: 12px 0;
        box-sizing: border-box;
    }

    .progress-bar-background {
        flex-grow: 1;
        height: 10px;
        background: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        background: #b772f4;
        transition: width 0.3s ease;
    }

    .progress-text {
        font-weight: bold;
        min-width: 45px;
        text-align: right;
    }
</style>