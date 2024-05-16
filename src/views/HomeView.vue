<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import slugify from "slugify";
import DOMPurify from "dompurify";

interface Post {
  id: number;
  title: string;
  content: string;
  img: string;
}

const posts = ref<Post[]>([]);

const logout = async () => {
  try {
    await axios.post("http://localhost:8000/logout");
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

const getUserName = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/api/user");
  } catch (error) {
    console.error("Failed to get user data", error);
  }
};

onMounted(async () => {
  const { data } = await axios.get("http://localhost:8000/api/posts");
  posts.value = data;
  await getUserName();
});

function truncateContent(content: string) {
  return content && content.length > 150
    ? DOMPurify.sanitize(content.substring(0, 150) + "...")
    : DOMPurify.sanitize(content);
}
</script>

<template>
  <div v-for="post in posts" :key="post.id" class="container">
    <div class="post">
      <img :src="`${post.img}.avif`" alt="post image" />
      <div class="desc">
        <h2>{{ post.title }}</h2>
        <p v-html="truncateContent(post.content)"></p>
        <router-link
          :to="{
            name: 'PostView',
            params: { id: post.id, title: slugify(post.title) },
          }"
        >
          Read more...
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>

.post {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  width: 100vw;
}

.desc {
  display: flex;
  flex-direction: column;
  max-width: 50%;
}

.desc h2 {
  font-family: 'Synonym', sans-serif;
  width: 1000px;
}

.desc p, a {
  font-family: 'Amulya', sans-serif;
}

h2, p, a {
  margin: 0 1rem 0;
}

a, a:visited {
  color: inherit;
  text-underline-offset: 0.25rem;
}

img {
  width: 250px;
  height: auto;
  border-radius: 0.25rem;
}
</style>
