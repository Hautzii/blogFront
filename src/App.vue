<script setup lang="ts">
import { onMounted } from 'vue'
import axios from 'axios'
import { RouterView } from 'vue-router'

// todo : put all requests in apiService file and export them to views

axios.defaults.withCredentials = true; // set withCredentials to true globally
axios.defaults.withXSRFToken = true;

onMounted(async () => {
  try {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Could not get CSRF cookie', error);
  }
});
</script>

<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped>

</style>