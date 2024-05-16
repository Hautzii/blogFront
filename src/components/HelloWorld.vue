<script setup lang="ts">
import axios from 'axios'
const { data } = await axios.get('http://127.0.0.1:8000/api/posts')
const posts = data
console.log(posts)
</script>

<template>
  <div v-for="post in posts" :key="post.id">
    {{ posts.title }}
  </div>
</template>

<style scoped>

</style>
