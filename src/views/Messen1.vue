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

const sizeChart = {
    S: {TaU: 68, BaU: 80},
    M: {TaU: 76, BaU: 88}
}

const measurements = ref([
    {id: 'TaU', label: 'Taillenumfang waagerecht', value: sizeChart.M.TaU, unit: 'cm', tags: ['hose', 'rock', 'top']},
    {id: 'BaU', label: 'Bauchumfang', value: sizeChart.M.BaU, unit: 'cm', tags: ['hose', 'top', 'rock']}
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
    return measurements.value.filter(m => m.tags.includes(selectetCloth.value))
})
</script>

<template>
    <h1>Halloooo</h1>

<div class="controls">
    <div class="form-group">
        <label for="cloth-select">Kleidungsstück:</label>
        <select id="cloth-select"> v-model="selectedCloth">
            <option v-for="item in clothes" :key="item.id" :value="item.id">
                {{ item.name }}
            </option>
        </select>
    </div>

    <div class="form-group">
        <label for="size-select">Standardgrösse laden:</label>
        <select id="size-select" v-model="selectedSize" @change="applyStandardSize">
            <option value="S">Grösse S</option>
            <option value="S">Grösse M</option>
            <option value="S">Grösse L</option>
            <option value="S">Grösse XL</option>
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