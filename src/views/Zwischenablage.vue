   
  <div class="silhouette-container">
    <!-- Frame 1: Vorne -->
    <svg 
      v-show="activeFrames.includes('front')" 
      viewBox="0 0 500 500" 
      class="silhouette-svg"
    >
      <!-- Vektorpfade der Vorderansicht -->
      <!-- Die Linien steuerst du mit v-show="activeMeasurementId === 'BrU'" -->
    </svg>

    <!-- Frame 2: Seite -->
    <svg 
      v-show="activeFrames.includes('side')" 
      viewBox="0 0 500 500" 
      class="silhouette-svg"
    >
      <!-- Vektorpfade der Seitenansicht -->
    </svg>

    <!-- Frame 3, 4, 5 analog dazu... -->
  </div>

  <!-- Eingabe-Liste -->
  <div v-for="item in relevantMeasurements" :key="item.id">
    <label :for="item.id">{{ item.label }}</label>
    <input 
      type="number" 
      :id="item.id" 
      v-model.number="item.value"
      @focus="handleFocus(item)"
      @blur="handleBlur"
    />
  </div>

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
