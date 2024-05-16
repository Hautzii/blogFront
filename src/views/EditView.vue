<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

interface Post {
  id: number;
  title: string;
  content: string;
  img: string;
  created_at: string;
}

const posts = ref<Post[]>([]);
const route = useRoute();

onMounted(async () => {
  const { data } = await axios.get("http://127.0.0.1:8000/api/raw");
  posts.value = data;
});

const post = computed(() => {
  const foundPost = posts.value.find((p) => p.id === Number(route.params.id));
  return foundPost ? foundPost : { id: 0, title: '', content: '', img: '', created_at: '' };
});

const edit = async () => {
  try {
    await axios.put(`http://127.0.0.1:8000/api/posts/${post.value.id}`, post.value);
  }
  catch (error) {
    console.error("Failed to update post", error);
  }
}
</script>

<template>
  <div>
    <h1>Edit</h1>
    <form @submit.prevent="edit">
      <label>
        Title:
        <input type="text" v-model="post.title">
      </label>
      <label>
        Content:
        <textarea v-model="post.content"></textarea>
      </label>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
input {
  width: 500px;
}
textarea {
  width: 750px;
  height: 750px;
}
</style>