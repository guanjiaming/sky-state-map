<template>
  <div id="map" ref="map"></div>
</template>

<script setup>
import {onMounted, useTemplateRef} from "vue";
import {initMap} from "@/map/index.js";

const mapRef = useTemplateRef('map');
onMounted(() => {
  initMap(mapRef.value)
})
</script>

<style scoped>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}
</style>
