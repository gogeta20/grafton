<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '@/core/config/network/Api';
import { userStore } from "@/core/stores/userStore";
const router = useRouter();

const username = ref('');
const password = ref('');
const rememberMe = ref(false);
const errorMessage = ref('');

const login = async () => {
  const usuarioStore = userStore();
  try {
    const response = await api.post('/api/login', { email: username.value, password: password.value });
    if (response.status === 200) {
      usuarioStore.data.email = username.value;
      usuarioStore.data.token = response.data.token;
      usuarioStore.data.isAuthenticated = true;
      router.push('/articles');
    }
  } catch (error) {
    errorMessage.value = 'Login failed. Please check your credentials.';
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="username">Usuario:</label>
          <input type="text" id="username" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #6a11cb, #2575fc);
}

.login-box {
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.input-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-group.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.input-group.options a {
  color: #2575fc;
  text-decoration: none;
  font-size: 0.875rem;
}

.input-group.options a:hover {
  text-decoration: underline;
}

.btn-primary {
  background-color: #2575fc;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1b5bbf;
}

.error {
  color: red;
  margin-bottom: 1rem;
}
</style>
