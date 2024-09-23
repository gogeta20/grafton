<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { api } from '@/core/config/network/Api';
import { Modal } from 'bootstrap';
import { userStore } from "@/core/stores/userStore";

const props = defineProps({
  newUser: {
    type: Boolean,
    default: false,
  },
});

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

const usuarioStore = userStore();
const user = ref<User>({
  id: '',
  name: '',
  email: '',
  password: '',
});

const password = ref('');
const isLoading = ref(false);
let modal: Modal | null = null;

const fetchUserData = async () => {
  if (props.newUser) {
    user.value = {
      id: '',
      name: '',
      email: '',
      password: '',
    }
    return;
  }

  isLoading.value = true;
  try {
    const response = await api.get('/api/user');
    user.value = response.data.data;
  } catch (error) {
    console.error("Error al obtener los datos del usuario:", error);
  } finally {
    isLoading.value = false;
  }
};

const openEditModal = () => {
  modal = new Modal(document.getElementById('editUserModal') as HTMLElement);
  modal.show();
};

const updateUser = async () => {
  isLoading.value = true;
  try {
    const payload: any = {
      new_email: user.value?.email,
      username: user.value?.name,
    };

    if (password.value) {
      payload.password = password.value;
    }

    await api.put('/api/user', payload);
    const response = await api.get('/check/' + user.value.email);
    usuarioStore.data.token = response.data.data.token;
    modal?.hide();
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
  } finally {
    isLoading.value = false;
  }
};

const createUser = async () => {
  isLoading.value = true;
  try {
    const payload = {
      email: user.value.email,
      password: password.value || 'default_password',
    };

    await api.post('/api/register', payload);
    modal?.hide();
  } catch (error) {
    console.error("Error al crear un nuevo usuario:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchUserData();
});

const handleSave = () => {
  if (props.newUser) {
    createUser();
  } else {
    updateUser();
  }
};

</script>

<template>
  <div class="container mt-2">
    <h3>{{ newUser ? 'Crear Nuevo Usuario' : 'Perfil de Usuario' }}</h3>

    <div v-if="isLoading" class="loader">Cargando...</div>

    <div v-else>
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">{{ user?.name || 'Nuevo Usuario' }}</h5>
          <div class="mb-3">
            <label for="userName" class="form-label">Nombre</label>
            <input v-model="user.name" type="text" class="form-control" id="userName" required />
          </div>
          <div class="mb-3">
            <label for="userEmail" class="form-label">Email</label>
            <input v-model="user.email" type="email" class="form-control" id="userEmail" required />
          </div>
          <div class="mb-3">
            <label for="userPass" class="form-label">Contraseña</label>
            <input v-model="password" type="password" class="form-control" id="userPass" />
          </div>
          <button type="button" class="btn btn-primary" @click="handleSave">
            {{ newUser ? 'Crear Usuario' : 'Guardar Cambios' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  margin-top: 2rem;
}

.card {
  background-color: #282a36;
  color: #f8f8f2;
  border: 1px solid #44475a;
  border-radius: 8px;
}

.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  color: #50fa7b;
}

.btn-primary {
  background-color: #6272a4;
  border: none;
}

.btn-close {
  background-color: #f8f8f2;
  border: none;
}
</style>
