<script setup lang="ts">
import { ref, onMounted, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import DOMPurify from "dompurify";
import Lenis from "lenis";

interface Post {
  id: number;
  title: string;
  content: string;
  img: string;
  created_at: string;
}

const route = useRoute();

const useWindowWidth = () => {
  const windowWidth = ref(window.innerWidth);

  watchEffect(() => {
    const updateWindowWidth = () => windowWidth.value = window.innerWidth;
    window.addEventListener('resize', updateWindowWidth);
    return () => window.removeEventListener('resize', updateWindowWidth);
  });

  return { windowWidth };
};

const { windowWidth } = useWindowWidth();

const lenis = new Lenis();

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const post = ref<Post | null>(null);

onMounted(async () => {
  const { data } = await axios.get(`http://127.0.0.1:8000/api/posts/${route.params.id}`);
  post.value = data;
});

const formattedContent = computed(() => {
  if (post.value) {
    return DOMPurify.sanitize(post.value.content);
  }
  return "";
});

const formattedTitle = computed(() => {
  return post.value ? post.value.title.replace(":", ":<br>") : "";
});

const formattedDate = computed(() => {
  if (post.value) {
    const date = new Date(post.value.created_at);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  return "";
});

const imgType = computed(() => {
  return windowWidth.value <= 1024 ? '_mobile' : '_cover';
});
</script>

<template>
  <div class="container">
    <div class="content">
      <div
        class="review"
        :style="{ 'background-image': post ? `url(${post.img}${imgType}.avif)` : '' }"
      >
        <div class="review-header">
          <h1><router-link :to="{ name:'home' }">PixelPost</router-link></h1>
        </div>
        <div class="review-content">
          <h3 v-html="formattedTitle"></h3>
          <div class="review-info">
            <p>By Arthur Morvan | @Hautzii | {{ formattedDate }}</p>
          </div>
        </div>
      </div>
      <div class="desc" v-html="formattedContent"></div>
    </div>
  </div>
  <router-link :to="{ name:'EditView' }">Edit</router-link>
</template>

<style scoped>
.review {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100vw;
  height: 80vh;
  position: relative;
  color: white;
}

.review::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}

.review-header {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 2rem;
}

.review-header a, a:visited {
  color: inherit;
  text-decoration: none;
}

.review-content {
  z-index: 1;
  text-align: center;
}

.review-content h3, .review-info p, .desc :deep(h2), .review-header h1{
  font-family: 'Synonym', sans-serif;
}

.desc :deep(h2) {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  text-align: center;
}

.desc :deep(p) {
  font-family: 'Amulya', sans-serif;
}

.review-content h3 {
  font-size: 3.5rem;
  margin-bottom: 0.75rem;
}

.desc {
  max-width: 70vw;
  margin-top: 1rem;
  font-size: 1.2rem;
  line-height: 1.75;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

@media screen and (max-width: 768px) {
.review {
  height: 60vh;
}

  .review-content h3 {
    font-size: 2.5rem;
    max-width: 75vw;
  }

  .desc {
    max-width: 75vw;
  }

  .desc :deep(h2) {
    font-size: 2rem;
  }
}
</style>
