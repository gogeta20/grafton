<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

interface Article {
  id: number;
  title: string;
  body: string;
  price: number;
  mediaUrl: string;
}

const props = defineProps({
  article: Object,
});

const emit = defineEmits(['updateArticle', 'fileSelected']); // Emitimos también el archivo

const selectedFile = ref<File | null>(null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0]; // Obtener el archivo
    emit('fileSelected', selectedFile.value); // Emitir el archivo al padre
  }
};

const saveArticle = () => {
  const updatedArticle = { ...props.article, title: props.article.title, body: props.article.body };
  emit('updateArticle', updatedArticle);
};

</script>

<template>
  <div>
    <div>
      <label for="title">Título:</label>
      <input id="title" v-model="props.article.title" class="form-control" />
    </div>
    <div class="mt-3">
      <label for="description">Descripción:</label>
      <textarea id="description" v-model="props.article.body" class="form-control"></textarea>
    </div>
    <div class="mt-3">
      <label for="file">Subir Imagen:</label>
      <input type="file" id="file" @change="handleFileChange" class="form-control" />
    </div>
    <button @click="saveArticle" class="btn btn-primary mt-3">Guardar</button>
  </div>
</template>

<style scoped>
.form-control {
  background-color: #44475a;
  color: #f8f8f2;
  border: 1px solid #6272a4;
  border-radius: 4px;
}

.btn-primary {
  background-color: #6272a4;
  border: none;
}

.btn-secondary {
  background-color: #50fa7b;
  border: none;
  color: #282a36;
}

.btn-success {
  background-color: #bd93f9;
  border: none;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
}

.spinner-border.text-primary {
  color: #50fa7b;
}
</style>
