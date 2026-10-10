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

const sizeChart = { // Masse stimmen erst für M
    S: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5},
    M: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5},
    L: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5},
    XL: {KoeH:168, BrU:88, uBrU:77, TaU:72, HueU:97, HaU:36, HlB:6.5, AlT:20.1, RueL: 41.6, HueT: 21, BrT:28.1, gVL: 45.3, oRueB: 17.7, gRueB: 16.5, gArD: 9.3, gBrB: 18.2, BrPA: 8.8, SuB: 12.2, SuWi: 20, ArL: 60, OaU: 28, HagU: 15.8, sTaA: 106, OsU: 55.6, SiH: 26.1, SrH: 79.9, FeU: 24.5}
}

const measurements = ref([
    {id: 'KoeH', label: 'Körperhöhe', value: sizeChart.M.KoeH, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'BrU', label: 'Brustumfang', value: sizeChart.M.BrU, unit: 'cm', tags:['top']},
    {id: 'TaU', label: 'Taillenumfang waagerecht', value: sizeChart.M.TaU, unit: 'cm', tags: ['hose', 'rock', 'top']},
    {id: 'HueU', label: 'Hüftumfang', value: sizeChart.M.HueU, unit: 'cm', tags:['hose', 'rock']},
    {id: 'nTaU', label: 'natürlicher Taillenumfang', value: sizeChart.M.nTaU, unit: 'cm', tags:['rock', 'hose', 'top']},
    {id: 'vTaA', label: 'vorderer Taillenabstand', value: sizeChart.M.vTaA, unit: 'cm', tags:['hose']},
    {id: 'sTaA', label: 'seitlicher Taillenabstand', value: sizeChart.M.sTaA, unit: 'cm', tags:['hose']},
    {id: 'hTaA', label: 'hinterer Taillenabstand', value: sizeChart.M.hTaA, unit: 'cm', tags: ['hose']},
    {id: 'vTaH', label: 'vordere Taillenhöhe', value: sizeChart.M.vTaH, unit:'cm', tags:['hose']},
    {id: 'hTaH', label: 'hintere Taillenhöhe', value: sizeChart.M.hTaH, unit: 'cm', tags:['hose']},
    {id: 'sTaH', label: 'seitliche Taillenhöhe', value: sizeChart.M.sTaH, unit: 'cm', tags: ['hose']},
    {id: 'HaU', label: 'Halsansatzumfang', value: sizeChart.M.HaU, unit: 'cm', tags:['top']},
    {id: 'gRueL', label: 'Rückenlänge', value: sizeChart.M.gRueL, unit: 'cm', tags:['top']},
    {id: 'gBrT', label: 'Brusttiefe', value: sizeChart.M.gBrT, unit: 'cm', tags:['top']},
    {id: 'gVL', label: 'Vorderlänge', value: sizeChart.M.gVL, unit: 'cm', tags:['top']},
    {id: 'oRueB', label: 'obere Rückenbreite', value: sizeChart.M.oRueB, unit: 'cm', tags:['top']},
    {id: 'AlT', label: 'Armlochtiefe', value: sizeChart.M.AlT, unit: 'cm', tags:['top']},
    {id: 'gRueB', label: 'gemessene Rückenbreite', value: sizeChart.M.gRueB, unit: 'cm', tags:['top']},
    {id: 'gArD', label: 'Armdurchmesser', value: sizeChart.M.gArD, unit: 'cm', tags:['top']},
    {id: 'gBrB', label: 'Brustbreite', value: sizeChart.M.gBrB, unit: 'cm', tags:['top']},
    {id: 'BrPA', label: 'Brustpunktabstand', value: sizeChart.M.BrPA, unit: 'cm', tags:['top']},
    {id: 'oBrB', label: 'obere Brustbreite', value: sizeChart.M.oBrB, unit: 'cm', tags:['top']},
    {id: 'oBrA', label: 'Oberbrustabstand', value: sizeChart.M.oBrA, unit: 'cm', tags:['top']},
    {id: 'uBrU', label: 'Unterbrustumfang', value: sizeChart.M.uBrU, unit: 'cm', tags:['top']},
    {id: 'uBrA', label: 'Unterbrustabstand', value: sizeChart.M.uBrA, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuB', label: 'Schulterbreite', value: sizeChart.M.SuB, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'ArL', label: 'Armlänge', value: sizeChart.M.ArL, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'OaU', label: 'Oberarmumfang', value: sizeChart.M.OaU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'HagU', label: 'Handgelenkumfang', value: sizeChart.M.HagU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'HanU', label: 'Handumfang', value: sizeChart.M.HanU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'AraU', label: 'Armansatzumfang', value: sizeChart.M.AraU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuWi', label: 'Schulterwinkel', value: sizeChart.M.SuWi, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SuH', label: 'Schulterhöhe', value: sizeChart.M.SuH, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'HueT', label: 'Hüfttiefe', value: sizeChart.M.HueT, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SiH', label: 'Sitzhöhe', value: sizeChart.M.SiH, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'SrH', label: 'Schritthöhe', value: sizeChart.M.SrH , unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'OsU', label: 'Oberschenkelumfang', value: sizeChart.M.OsU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'KnU', label: 'Knieumfang', value: sizeChart.M.KnU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'uKnU', label: 'Unterknieumfang', value: sizeChart.M.uKnU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'WaU', label: 'Wadenumfang', value: sizeChart.M.WaU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'FeU', label: 'Fesselumfang', value: sizeChart.M.FeU, unit: 'cm', tags:['top', 'hose', 'rock']},
    {id: 'RiU', label: 'Ristumfang', value: sizeChart.M.RiU, unit: 'cm', tags:['top', 'hose', 'rock']},
])

function applyStandardSize() {
    const chartValues = sizeChart[selectedSize.value]
    measurements.value.forEach(m => {
        if (chartValues[m.id] !== undefined) {
            m.value = chartValues[m.id]
        }
    })
}

const relevantMeasurements = computed(() => {
    return measurements.value.filter(m => m.tags.includes(selectedCloth.value))
})
</script>

<template>
    <h1>Halloooo</h1>

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

<div v-for="item in relevantMeasurements" :key="item.id" class="measurement-row">
    <label :for="item.id">{{ item.label }}</label>
    <input 
        type="number"
        :id="item.id"
        v-model.number="item.value"
    />
    <span>{{ item.unit }}</span>
</div>

</template>

<style>
    .form-container {
    display: grid;
    grid-template-columns: auto 150px; 
    gap: 12px 16px;
    align-items: center;
    max-width: 300px;
    }

    .form-container label {
    text-align: left;
    }
</style>