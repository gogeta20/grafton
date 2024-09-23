<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import { api } from '@/core/config/network/Api';
import ArticleEditForm from './ArticleEditForm.vue';
import UserForm from './UserForm.vue';
import { userStore } from "@/core/stores/userStore";
import { Modal } from 'bootstrap';
// Definimos el componente Article para tipos
interface Article {
  id: string;
  title: string;
  body: string;
  mediaUrl: string;
  files: string;
  isFavorite: boolean;
  email: string;
}
const usuarioStore = userStore();
const articles = ref<Article[]>([]);
const isLoading = ref(false);
const selectedArticle = ref<Article | null>(null);
const newArticle = ref<Article | null>(null);
let selectedFile = ref<File | null>(null); // Archivo seleccionado
let showingFavorites = ref(false); // Estado para el toggle de favoritos
let modal: Modal | null = null;
let newUser = ref(false);

const fetchArticles = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/api/content');
    articles.value = response.data.data;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const fetchFavorites = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/api/favorites');
    const favorites = response.data.data.map((item: any) => {
      const article = item.article;
      article.isFavorite = true; // Marcar como favorito
      return article;
    });
    articles.value = favorites;
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const toggleFavorites = async () => {
  showingFavorites.value = !showingFavorites.value;
  if (showingFavorites.value) {
    await fetchFavorites(); // Mostrar solo favoritos
  } else {
    await fetchArticles(); // Volver a mostrar todos los artículos
  }
};

const openEditModal = (article: Article) => {
  selectedArticle.value = { ...article };
  modal = new Modal(document.getElementById('editArticleModal') as HTMLElement);
  modal.show();
};

const openCreateModal = () => {
  newArticle.value = {
    id: '',
    title: '',
    body: '',
    mediaUrl: '',
    files: '',
    isFavorite: false
  };
  modal = new Modal(document.getElementById('createArticleModal') as HTMLElement);
  modal.show();
};

const openEditUserModal = () => {
  modal = new Modal(document.getElementById('userModal') as HTMLElement);
  modal.show();
};

const openCreateUserModal = () => {
  newUser.value = true;
  modal = new Modal(document.getElementById('createUserModal') as HTMLElement);
  modal.show();
};

const allArticles = async () => {

  const response = await api.get(`/api/content/all`);
  const all = response.data.data.map((item: any) => {
    const article = item;
    return article;
  });
  articles.value = all;
};

const updateArticle = async (updatedArticle: Article) => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('id', updatedArticle.id);
    formData.append('title', updatedArticle.title);
    formData.append('body', updatedArticle.body);

    if (selectedFile.value) {
      formData.append('files', selectedFile.value); // Adjuntar el archivo
    }

    await api.post(`/api/content/${updatedArticle.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    await fetchArticles(); // Refrescar artículos después de actualizar
    modal.hide();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const createArticle = async (createdArticle: Article) => {
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('title', createdArticle.title);
    formData.append('body', createdArticle.body);

    if (selectedFile.value) {
      formData.append('files', selectedFile.value); // Adjuntar el archivo
    }

    await api.post(`/api/content`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    await fetchArticles(); // Refrescar artículos después de crear
    modal.hide();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const deleteArticle = async (articleId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
    isLoading.value = true;
    try {
      await api.delete(`/api/content/${articleId}`);
      await fetchArticles(); // Refrescar artículos después de eliminar
    } catch (error) {
      console.error(error);
    } finally {
      isLoading.value = false;
    }
  }
};

const toggleFavorite = async (article: Article) => {
  try {
    await api.post(`/api/content/${article.id}/favorite`);
    article.isFavorite = !article.isFavorite; // Alternar el estado de favorito
  } catch (error) {
    console.error(error);
  }
};

const handleFileSelected = (file: File) => {
  selectedFile.value = file;
};

onBeforeMount(() => {
  fetchArticles();
});
</script>

<template>
  <div class="container mt-5">
    <h1>Lista de Artículos</h1>
    <div class="mb-3 text-right">
      <button @click="openCreateModal" class="btn btn-success">Crear Artículo</button>
      <button @click="openEditUserModal" class="btn btn-success">Editar Usuario</button>
      <button @click="toggleFavorites" class="btn btn-secondary">
        {{ showingFavorites ? 'Ver Todos los Artículos' : 'Ver Favoritos' }}
      </button>
      <button @click="openCreateUserModal" class="btn btn-primary">Crear Nuevo Usuario</button>
      <button @click="allArticles" class="btn btn-primary">Ver Todos los articulos</button>
    </div>

    <div v-if="isLoading" class="loader">Cargando...</div>

    <div v-else class="row">
      <div v-for="article in articles" :key="article.id" class="col-md-4 mb-4">
        <div class="card h-100 product-card">
          <div class="image-container">
            <img :src="article.mediaUrl" :alt="article.title" class="card-img-top" />
          </div>
          <div class="card-body">
            <h5 class="card-title" :title="article.title">{{ article.title }}</h5>
            <p class="card-text description" :title="article.body">{{ article.body }}</p>
            <div v-if="usuarioStore.data.email === article.email" class="d-flex justify-content-between">
              <button @click="openEditModal(article)" class="btn btn-primary">Editar</button>
              <button @click="deleteArticle(article.id)" class="btn btn-danger">Eliminar</button>

              <button @click="toggleFavorite(article)"
                :class="['btn', article.isFavorite ? 'btn-secondary' : 'btn-outline-secondary']">
                {{ article.isFavorite ? 'Favorito' : 'Marcar como Favorito' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- edit -->
    <div class="modal fade" id="editArticleModal" tabindex="-1" aria-labelledby="editArticleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editArticleModalLabel">Editar Artículo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ArticleEditForm v-if="selectedArticle" :article="selectedArticle" @updateArticle="updateArticle"
              @fileSelected="handleFileSelected" />
          </div>
        </div>
      </div>
    </div>

    <!-- crear -->
    <div class="modal fade" id="createArticleModal" tabindex="-1" aria-labelledby="createArticleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createArticleModalLabel">Crear Artículo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <ArticleEditForm v-if="newArticle" :article="newArticle" @updateArticle="createArticle"
              @fileSelected="handleFileSelected" />
          </div>
        </div>
      </div>
    </div>

    <!-- user -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <UserForm />
          </div>
        </div>
      </div>
    </div>

    <!-- create user -->
    <div class="modal fade" id="createUserModal" tabindex="-1" aria-labelledby="createUserModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="createUserModalLabel">Crear Nuevo Usuario</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <UserForm :new-user="newUser" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.container {
  margin-top: 2rem;
}

.product-card {
  transition: transform 0.3s ease;
  background-color: #282a36;
  color: #f8f8f2;
  border: 1px solid #44475a;
  border-radius: 8px;
}

.product-card:hover {
  transform: translateY(-10px);
}

.image-container {
  background-color: #fff;
  padding: 10px;
  border-bottom: 1px solid #44475a;
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: contain;
}

.card-title,
.card-text {
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-title {
  font-size: 1.25rem;
  height: 60px;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.description {
  height: 99px;
  color: #FFC;
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

.btn-danger {
  background-color: #ff5555;
  border: none;
}

.btn-success {
  background-color: #50fa7b;
  border: none;
  color: #282a36;
}

.btn-secondary {
  background-color: #bd93f9;
  border: none;
  color: #f8f8f2;
}

.btn-close {
  background-color: #f8f8f2;
  border: none;
}
</style>
