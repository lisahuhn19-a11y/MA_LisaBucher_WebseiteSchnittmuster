<!-- src/views/StartseiteView.vue -->
<script setup>

import {ref, computed} from 'vue'

const clothes=ref([
    {id: 'rock', name: 'Rock'},
    {id: 'top', name: 'Top'},
    {id: 'hose', name: 'Hose'}
])

const selectedCloth = ref('rock')
const selectedSize = ref('M')
const activeFrames = ref([])
const activeMeasurementId = ref(null)

const sizeChart = { // Masse stimmen erst für M
    S: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5},
    M: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5},
    L: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5},
    XL: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5}
}

const measurements = ref([
    {id: 'KoeH', label: 'Körperhöhe', frames: ['front'], value: sizeChart.M.KoeH, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'BrU', label: 'Brustumfang', frames: ['front'], value: sizeChart.M.BrU, unit: 'cm', tags:['top']},
    {id: 'TaU', label: 'Taillenumfang waagerecht', frames: ['front'], value: sizeChart.M.TaU, unit: 'cm', tags: ['hose', 'rock', 'top']},
    {id: 'HueU', label: 'Hüftumfang', frames: ['front'], value: sizeChart.M.HueU, unit: 'cm', tags:['hose', 'rock']},
    {id: 'nTaU', label: 'natürlicher Taillenumfang', frames: ['front'], value: sizeChart.M.nTaU, unit: 'cm', tags:['rock', 'hose', 'top']},
    {id: 'vTaA', label: 'vorderer Taillenabstand', frames: ['side'], value: sizeChart.M.vTaA, unit: 'cm', tags:['hose']},
    {id: 'sTaA', label: 'seitlicher Taillenabstand', frames: ['side'], value: sizeChart.M.sTaA, unit: 'cm', tags:['hose']},
    {id: 'hTaA', label: 'hinterer Taillenabstand', frames: ['side'], value: sizeChart.M.hTaA, unit: 'cm', tags: ['hose']},
    {id: 'vTaH', label: 'vordere Taillenhöhe', frames: ['side'], value: sizeChart.M.vTaH, unit:'cm', tags:['hose']},
    {id: 'hTaH', label: 'hintere Taillenhöhe', frames: ['side'], value: sizeChart.M.hTaH, unit: 'cm', tags:['hose']},
    {id: 'sTaH', label: 'seitliche Taillenhöhe', frames: ['front'], value: sizeChart.M.sTaH, unit: 'cm', tags: ['hose']},
    {id: 'HaU', label: 'Halsansatzumfang', frames: ['front'], value: sizeChart.M.HaU, unit: 'cm', tags:['top']},
    {id: 'gRueL', label: 'Rückenlänge', frames: ['back'], value: sizeChart.M.gRueL, unit: 'cm', tags:['top']},
    {id: 'gBrT', label: 'Brusttiefe', frames: [], value: sizeChart.M.gBrT, unit: 'cm', tags:['top']},
    {id: 'gVL', label: 'Vorderlänge', frames: [], value: sizeChart.M.gVL, unit: 'cm', tags:['top']},
    {id: 'oRueB', label: 'obere Rückenbreite', frames: [], value: sizeChart.M.oRueB, unit: 'cm', tags:['top']},
    {id: 'AlT', label: 'Armlochtiefe', frames: [], value: sizeChart.M.AlT, unit: 'cm', tags:['top']},
    {id: 'gRueB', label: 'gemessene Rückenbreite', frames: ['back'], value: sizeChart.M.gRueB, unit: 'cm', tags:['top']},
    //{id: 'gArD', label: 'Armdurchmesser', frames: ['arm'], value: sizeChart.M.gArD, unit: 'cm', tags:['top']},
    {id: 'gBrB', label: 'Brustbreite', frames: ['front'], value: sizeChart.M.gBrB, unit: 'cm', tags:['top']},
    {id: 'BrPA', label: 'Brustpunktabstand', frames: ['front'], value: sizeChart.M.BrPA, unit: 'cm', tags:['top']},
    {id: 'oBrB', label: 'obere Brustbreite', frames: ['front'], value: sizeChart.M.oBrB, unit: 'cm', tags:['top']},
    {id: 'oBrA', label: 'Oberbrustabstand', frames: [], value: sizeChart.M.oBrA, unit: 'cm', tags:['top']},
    {id: 'uBrU', label: 'Unterbrustumfang', frames: [], value: sizeChart.M.uBrU, unit: 'cm', tags:['top']},
    {id: 'uBrA', label: 'Unterbrustabstand', frames: [], value: sizeChart.M.uBrA, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuB', label: 'Schulterbreite', frames: [], value: sizeChart.M.SuB, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'ArL', label: 'Armlänge', frames: ['arm'], value: sizeChart.M.ArL, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'OaU', label: 'Oberarmumfang', frames: ['arm'], value: sizeChart.M.OaU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'HagU', label: 'Handgelenkumfang', frames: ['front'], value: sizeChart.M.HagU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'HanU', label: 'Handumfang', frames: ['front'], value: sizeChart.M.HanU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'AraU', label: 'Armansatzumfang', frames: ['front', 'side'], value: sizeChart.M.AraU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuWi', label: 'Schulterwinkel', frames: ['front'], value: sizeChart.M.SuWi, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuH', label: 'Schulterhöhe', frames: ['front'], value: sizeChart.M.SuH, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'HueT', label: 'Hüfttiefe', frames: ['front'], value: sizeChart.M.HueT, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SiH', label: 'Sitzhöhe', frames: ['leg'], value: sizeChart.M.SiH, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SrH', label: 'Schritthöhe', frames: ['front'], value: sizeChart.M.SrH , unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'OsU', label: 'Oberschenkelumfang', frames: ['leg'], value: sizeChart.M.OsU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'KnU', label: 'Knieumfang', frames: ['leg'], value: sizeChart.M.KnU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'uKnU', label: 'Unterknieumfang', frames: ['leg'], value: sizeChart.M.uKnU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'WaU', label: 'Wadenumfang', frames: ['leg'], value: sizeChart.M.WaU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'FeU', label: 'Fesselumfang', frames: ['leg'], value: sizeChart.M.FeU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'RiU', label: 'Ristumfang', frames: ['leg'], value: sizeChart.M.RiU, unit: 'cm', tags:['top', 'hose', 'rock']},
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
    return measurements.value.filter(m => m.tags.includes(selectedCloth.value))
})
</script>


<template>
    <div class="view-container">
        <div class="silhouette-container">
            src\assets\front.svg
            <svg
                v-show="activeFrames.includes('front')" 
                viewBox="0 0 500 500" 
                class="silhouette-svg"
            >
                <!--Vektorpfade vorne-->
            </svg>
            src\assets\side.svg
            <svg
                v-show="activeFrames.includes('side')"
                viewBox="0 0 500 500"
                class="silhouette-svg"
            >
                <!-- Vektorpfade Seite -->
            </svg>
            src\assets\back.svg
            <svg
                v-show="activeFrames.includes('side')"
                viewBox="0 0 500 500"
                class="silhouette-svg"
            >
                <!-- Vektorpfade Ruecken -->
            </svg>
            src\assets\arm.svg
            <svg
                v-show="activeFrames.includes('side')"
                viewBox="0 0 500 500"
                class="silhouette-svg"
            >
                <!-- Vektorpfade Arm -->
            </svg>
            src\assets\leg.svg
            <svg 
                v-show="activeFrames.includes('side')"
                viewBox="0 0 500 500"
                class="silhouette-svg"
            >
                <!-- Vektorpfade Bein -->
            </svg>
        </div>

        <!-- Steuerung -->
        <div class="controls">
            <div class="form-group">
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
</template>

<style scoped>
    .view-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
    }

    .controls {
        display: flex;
        gap: 16px;
    }

    .form-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-width: 400px;
    }

    .measurement-row {
        display: grid;
        grid-template-columns: 200px 100px auto;
        gap: 8px;
        align-items: center;
    }

    .silhouette-container {
        width: 500px;
        height: 500px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        border: 1px dashed #ccc;
    }

    .silhouette-svg {
        max-width: 100%;
        max-height: 100%;
        flex: 1 1 auto; 
    }
</style>