<!-- src/views/StartseiteView.vue -->
<script setup>
// Hier kannst du später Skripte oder Daten hinzufügen
</script>

<template>
  <div>

    <h1>Masse nehmen</h1>
    <h2>halloo</h2>
    <p>trage deine Masse ein, damit das massgeschneiderte Schnittmuster erstellt werden kann.</p>
    <div class="form-container">
<!--Umfangsmasse-->
        <label for="1">Brustumfang</label> 
        <input type="number" id="1"> 
        <label for="2">Taillenumfang</label>
        <input type="number" id="2"> 
        <label for="3">Bauchumfang</label>
        <input type="number" id="3"> 
        <label for="4">Hüftumfang</label>
        <input type="number" id="4"> 

        <!--Oberkörper-->
        <label for="5f">Vordere Mitte Länge</label>
        <input type="number" id="5f"> 
        <label for="5b">Rückenlänge</label>
        <input type="number" id="5b"> 
        <label for="6f">Gesamtlänge vorne</label>
        <input type="number" id="6f"> 
        <label for="6b">Gesamtlänge hinten</label>
        <input type="number" id="6b"> 
        <label for="7f">Schulterneigung vorne</label>
        <input type="number" id="7f"> 
        <label for="7b">Schulterneigung hinten</label>
        <input type="number" id="7b"> 
        <label for="8">Schultermass</label>
        <input type="number" id="8"> 
        <label for="9">Brusthöhe</label>
        <input type="number" id="9"> 
        <label for="10">Brustpunktabstand</label>
        <input type="number" id="10"> 
        <label for="11">Seitenlänge</label>
        <input type="number" id="11"> 
        <label for="12">Halslochbreite</label>
        <input type="number" id="12"> 
        <label for="13">Schulterlänge</label>
        <input type="number" id="13"> 
        <label for="14f">Ganze Schulterbreite vorne</label>
        <input type="number" id="14f"> 
        <label for="14b">Ganze Schulterbreite hinten</label>
        <input type="number" id="14b"> 
        <label for="15">Brustbreite</label>
        <input type="number" id="15"> 
        <label for="16">Rückenbreite</label>
        <input type="number" id="16"> 
        <label for="17">Vordere Brustumfangshälfte</label>
        <input type="number" id="17"> 
        <label for="18">Hintere Rückenumfangshälfte</label>
        <input type="number" id="18"> 
        <label for="19f">Vordere Taillenbreite</label>
        <input type="number" id="19f"> 
        <label for="19b">Hintere Taillenbreite</label>
        <input type="number" id="19b"> 
        <label for="20f">Abnäherposition Vorne</label>
        <input type="number" id="20f"> 
        <label for="20b">Abnäherposition Hinten</label>
        <input type="number" id="20b"> 
        <label for="21f">Standard-Abnäherinhalt Vorne</label>
        <input type="number" id="21f"> 
        <label for="21b">Standard-Abnäherinhalt Hinten</label>
        <input type="number" id="21b"> 

        <!--Unterer Rumpf-->
        <label for="22f">Vordere Bauchbreite</label>
        <input type="number" id="22f"> 
        <label for="22b">Hintere Bauchbreite</label>
        <input type="number" id="22b"> 
        <label for="23f">Vordere Hüftbreite</label>
        <input type="number" id="23f"> 
        <label for="23b">Hintere Hüftbreite</label>
        <input type="number" id="23b"> 
        <label for="24">Sitzhöhe</label>
        <input type="number" id="24"> 
        <label for="25f">Hüfthöhe vorne</label>
        <input type="number" id="25f"> 
        <label for="25b">Hüfthöhe hinten</label>
        <input type="number" id="25b"> 
        <label for="26">Seitliche Hüfthöhe</label>
        <input type="number" id="26"> 
        <label for="27_1">Taille bis Knie</label>
        <input type="number" id="27_1"> 
        <label for="27_2">Taille bis Knöchel</label>
        <input type="number" id="27_2"> 
        <label for="27_3">Taille bis Boden</label>
        <input type="number" id="27_3"> 
        <label for="28_1">gesamte Schrittlänge</label>
        <input type="number" id="28_1"> 
        <label for="28_2">Vertikaler Rumpfumfang</label>
        <input type="number" id="28_2"> 
        <label for="29_1">Oberschenkelweite</label>
        <input type="number" id="29_1"> 
        <label for="29_2">Mittlere Oberschenkelweite</label>
        <input type="number" id="29_2"> 
        <label for="30">Knieweite</label>
        <input type="number" id="30"> 
        <label for="31">Wadenweite</label>
        <input type="number" id="31"> 
        <label for="32">Knöchelumfang</label>
        <input type="number" id="32">
    </div>


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