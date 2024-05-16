<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
});

const register = async () => {
  if (form.value.password == form.value.password_confirmation) {
    await axios.post('http://localhost:8000/register', form.value);
    console.log('Registration successful');
  } else {
    console.error('Passwords do not match');
  }
};

const logout = async () => {
  try {
    await axios.post('http://localhost:8000/logout');
    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed', error);
  }
};
</script>

<template>
  <div>
    <h1>Register</h1>
  </div>
  <div>
    <form @submit.prevent="register">
      <label>
        Name:
        <input type="text" v-model="form.name" required>
      </label>
      <label>
        Email:
        <input type="email" v-model="form.email" required>
      </label>
      <label>
        Password:
        <input type="password" v-model="form.password" required>
      </label>
      <label>
        Confirm Password:
        <input type="password" v-model="form.password_confirmation" required>
      </label>
      <div>
        <span v-if="form.password !== form.password_confirmation">Passwords do not match</span>
      </div>
      <button type="submit">Register</button>
    </form>
  </div>
  <button @click="logout">Logout</button>
</template>

<style scoped></style>