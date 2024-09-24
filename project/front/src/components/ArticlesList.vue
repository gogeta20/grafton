<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import { api } from '@/core/config/network/Api';
import ArticleEditForm from './ArticleEditForm.vue';
import UserForm from './UserForm.vue';
import { userStore } from "@/core/stores/userStore";
import { Modal } from 'bootstrap';
import { allArticles } from '@/Article/Infrastructure/useCase/GetAllArticles';
import { useMyArticles } from '@/Article/Application/MyArticles';
import { useMyFavorites } from '@/Article/Application/MyFavorites';
import { useDeleteArticle } from '@/Article/Application/DeleteArticle';
import { useCreateArticle } from '@/Article/Application/CreateArticle';
import { useUpdatedArticle } from '@/Article/Application/UpdatedArticle';
import { useToggleFavorite } from '@/Article/Application/ToggleFavorite';
import { useRouter } from 'vue-router';
const router = useRouter();
interface Article {
  id: string;
  title: string;
  body: string;
  mediaUrl: string;
  files: string;
  isFavorite: number;
  email: string | null;
}
const usuarioStore = userStore();
const articles = ref<Article[]>([]);
const isLoading = ref(false);

let selectedFile = ref<File | null>(null);
let modal: Modal | null = null;
let newUser = ref(false);
const titleSection = ref('Mis Articulos')
const newArticle = ref({
  id: '',
  title: '',
  body: '',
  mediaUrl: '',
  files: '',
  isFavorite: false
});
const selectedArticle = ref({
  id: '',
  title: '',
  body: '',
  mediaUrl: '',
  files: '',
  isFavorite: false
});
const fetchArticles = async () => {
  isLoading.value = true;
  articles.value = await useMyArticles().refetch();
  isLoading.value = false;
};

const fetchFavorites = async () => {
  isLoading.value = true;
  articles.value = await useMyFavorites().refetch();
  isLoading.value = false;
};

const allArticlesResolve = async () => {
  isLoading.value = true;
  articles.value = await allArticles();
  isLoading.value = false;
};

const toggleFavorites = async () => {
  titleSection.value = 'Favoritos';
  await fetchFavorites();
};

const toggleAll = async () => {
  titleSection.value = 'Todos';
  await allArticlesResolve();
};

const toggleMy = async () => {
  titleSection.value = 'Mis Articulos';
  await fetchArticles();
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

const salir = () => {
  usuarioStore.data.isAuthenticated = false;
  router.push('/');

};

const updateArticle = async (updatedArticle: Article) => {
  isLoading.value = true;
  await useUpdatedArticle().refetch(updatedArticle, selectedFile.value);
  await fetchArticles();
  modal.hide();
  isLoading.value = false;
};

const createArticle = async (createdArticle: Article) => {
  isLoading.value = true;
  await useCreateArticle().refetch(createdArticle, selectedFile.value);
  await fetchArticles();
  modal.hide();
  isLoading.value = false;
};

const deleteArticle = async (articleId: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
    isLoading.value = true;
    await useDeleteArticle().refetch(articleId);
    await fetchArticles();
    isLoading.value = false;
  }
};

const toggleFavorite = async (article: Article) => {
  try {
    await useToggleFavorite().refetch(article.id);
    article.isFavorite = !article.isFavorite;
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
  <div class="container container-height">
    <h1>Lista de Artículos</h1>
    <h4>{{ titleSection }}</h4>
    <div class="d-flex justify-content-between">
      <div class="mb-3 d-flex justify-content-center gap-2">
        <button @click="openCreateModal" class="btn btn-primary btn-sm">Crear Artículo</button>
        <button @click="toggleMy" class="btn btn-primary btn-sm">Mis Artículos</button>
        <button @click="toggleFavorites" class="btn btn-primary btn-sm">Favoritos</button>
        <button @click="toggleAll" class="btn btn-primary btn-sm">Todos</button>
      </div>

      <div class="mb-3 d-flex justify-content-center gap-2">
        <button @click="openEditUserModal" class="btn btn-primary btn-sm ">Editar Usuario</button>
        <button @click="openCreateUserModal" class="btn btn-primary btn-sm">Crear Nuevo Usuario</button>
        <button @click="salir" class="btn btn-danger btn-sm">Salir</button>
      </div>
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
            <p class="card-text" :title="article.title">Autor: {{ article.email }}</p>
            <div v-if="usuarioStore.data.email === article.email" class="d-flex justify-content-between">
              <div class="d-flex gap-2">
                <button @click="openEditModal(article)" class="btn btn-primary">Editar</button>
                <button @click="deleteArticle(article.id)" class="btn btn-danger">Eliminar</button>
              </div>
              <button @click="toggleFavorite(article)"
                :class="['btn', article.isFavorite ? 'btn-success' : 'btn-outline-secondary']">
                <i v-if="article.isFavorite" class="bi bi-balloon-heart"></i>
                <i v-else="article.isFavorite" class="bi bi-balloon-heart"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- edit article-->
    <div class="modal fade" id="editArticleModal" tabindex="-1" aria-labelledby="editArticleModalLabel"
      aria-hidden="true">
      <ArticleEditForm v-if="selectedArticle" :article="selectedArticle" @updateArticle="updateArticle"
        @fileSelected="handleFileSelected" />
    </div>

    <!-- crear article-->
    <div class="modal fade" id="createArticleModal" tabindex="-1" aria-labelledby="createArticleModalLabel"
      aria-hidden="true">
      <ArticleEditForm v-if="newArticle" :article="newArticle" @updateArticle="createArticle"
        @fileSelected="handleFileSelected" />
    </div>

    <!-- user -->
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
      <UserForm />
    </div>

    <!-- create user -->
    <div class="modal fade" id="createUserModal" tabindex="-1" aria-labelledby="createUserModalLabel"
      aria-hidden="true">
      <UserForm :new-user="newUser" />
    </div>

  </div>
</template>

<style scoped>
.container {
  margin-top: 2rem;
}

.container-height {
  height: 90vh;
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
  /* padding: 10px; */
  border-bottom: 1px solid #44475a;
}

.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
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
