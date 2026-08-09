<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { deleteWord, getWords, useFlash } from '../helpers/api';
import type { Word } from '../components/WordForm.vue';
import { isLoggedIn } from '../helpers/auth';

const words = ref<Word[]>([]);
const { flash } = useFlash();

const currentPage = ref(1);
const pageSize = 10;

const totalPages = computed(() =>
  Math.max(1, Math.ceil(words.value.length / pageSize))
);

const paginatedWords = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return words.value.slice(start, start + pageSize);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

onMounted(async () => {
  words.value = await getWords();
});

const onDestroy = async (id?: string) => {
  if (!id) return;

  const result = await Swal.fire({
    title: 'Confirm Deletion',
    text: 'Are you sure you want to delete this word?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  if (!result.isConfirmed) return;

  try {
    await deleteWord(id);

    words.value = words.value.filter(word => word._id !== id);

    if (currentPage.value > totalPages.value) {
      currentPage.value = Math.max(1, totalPages.value);
    }

    await Swal.fire({
      title: 'Deleted',
      text: 'The word was successfully deleted.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (error) {
    await Swal.fire({
      title: 'Error',
      text: 'The word could not be deleted.',
      icon: 'error',
    });
  }
};
</script>

<template>
<div class="main-container">
  <div class="words-container">
    <div class="words-content">
      <h1 class="words-title">Vocabulary Words</h1>

      <div class="table-container">
        <table class="ui celled table words-table">
          <thead>
            <tr>
              <th>English</th>
              <th>German</th>
              <th>French</th>
              <th :colspan="isLoggedIn ? 3 : 1" class="center aligned">Actions</th>
            </tr>
          </thead>

         <tbody>
  <tr v-for="word in paginatedWords" :key="word._id">
    <td>{{ word.english }}</td>
    <td>{{ word.german }}</td>
    <td>{{ word.french }}</td>

    <td class="action-cell">
      <router-link
        :to="{ name: 'show', params: { id: word._id } }"
        class="ui green icon button"
      >
        <i class="eye icon"></i>
      </router-link>
    </td>

    <td v-if="isLoggedIn" class="action-cell">
      <router-link
        :to="{ name: 'edit', params: { id: word._id } }"
        class="ui orange icon button"
      >
        <i class="edit icon"></i>
      </router-link>
    </td>

    <td v-if="isLoggedIn" class="action-cell">
      <button
        @click="onDestroy(word._id)"
        class="ui red icon button"
      >
        <i class="trash icon"></i>
      </button>
    </td>
  </tr>
</tbody>
        </table>
      </div>

      <div class="pagination">
        <button
          class="ui labeled icon button"
          :disabled="currentPage === 1"
          @click="previousPage"
        >
          <i class="left arrow icon"></i>
          Previous
        </button>

        <div class="page-info">
          {{ currentPage }} / {{ totalPages }}
        </div>

        <button
          class="ui right labeled icon button"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          Next
          <i class="right arrow icon"></i>
        </button>
      </div>
    </div>
  </div>
</div>
</template>
<style scoped>


.main-container {
  width: 100vw;
 
  margin-left: calc(50% - 50vw);
  padding: 28px 24px;
  background-color: #f8fafc;
}

.words-container {
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
}

.words-title {
  margin: 0 0 28px;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
}

.table-container {
  width: 100%;
  padding: 12px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.07);
}

table.words-table.ui.table {
  width: 100%;
  margin: 0;
  table-layout: fixed;
}

table.words-table.ui.table thead th {
  height: 48px;
  padding: 12px 18px;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.action-cell {
    width: 70px;
    text-align: center;
    vertical-align: middle;
    padding: 12px;
}


</style>