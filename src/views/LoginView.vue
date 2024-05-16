<script setup lang="ts">
import { onMounted, ref } from "vue";
import axios from "axios";
import router from "@/router";

const form = ref({
  email: '',
  password: ''
});

const username = ref(''); // to store the fetched username

const getUser = async () => {
  try {
    const { data } = await axios.get("http://localhost:8000/api/user");
    username.value = data.name;
  } catch (error) {
    console.error("Could not get user", error);
  }
}

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8000/login', form.value);
    
    if (response.status === 200) {
      console.log('Login successful');
      router.push({ name: 'home' });
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Login request failed', error);
  }
};

const logout = async () => {
  try {
    await axios.post("http://localhost:8000/logout");
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout failed", error);
  }
};

onMounted(async () => {
  getUser();
});

</script>

<template>
  <div>
    <h1>Login</h1>
    <p v-if="username">Welcome, {{ username }}</p>
  </div>
  <div>
    <form @submit.prevent="login">
      <label>
        Email:
        <input type="email" v-model="form.email" required>
      </label>
      <label>
        Password:
        <input type="password" v-model="form.password" required>
      </label>
      <button type="submit">Login</button>
    </form>
    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped></style>