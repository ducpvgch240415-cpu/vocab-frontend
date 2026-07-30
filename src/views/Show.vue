<script setup lang="ts">
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { deleteWord, getWordById, useFlash } from '../helpers/api';
import type { Word } from '../components/WordForm.vue';
import '../assets/show.css';
const route = useRoute();
const router = useRouter();
const word = ref<Word>({ english: '', german: '' });
const { flash } = useFlash();

onMounted(async () => {
  try {
    const id = route.params.id as string;
    word.value = await getWordById(id);
  } catch (error) {
    console.error('Error fetching the word:', error);
  }
});

const onDestroy = async () => {
  if (!word.value._id) return;

  const result = await Swal.fire({
    title: 'Delete Word?',
    text: 'Are you sure you want to delete this word?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#db2828',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
  });

  if (!result.isConfirmed) return;

  try {
    await deleteWord(word.value._id);

    await Swal.fire({
      title: 'Deleted!',
      text: 'The word has been successfully deleted.',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    flash('Word successfully deleted', 'success');
    router.push('/words');
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Failed to delete the word.',
      icon: 'error',
      confirmButtonText: 'OK',
    });

    flash('Error deleting word', 'error');
  }
};
</script>

<template>
  <div class="show-page">
    <div class="ui raised segment word-card">
      <div class="ui centered header">
        <i class="language icon"></i>

        <div class="content">
          Word Detail
          <div class="sub header">
            View, edit, or delete this vocabulary word
          </div>
        </div>
      </div>

      <div class="ui divider"></div>

      <div class="word-details">
        <div class="detail-row">
          <div class="detail-icon">
            <i class="uk flag"></i>
          </div>

          <div class="detail-content">
            <div class="detail-label">English Word</div>
            <div class="detail-value">
              {{ word.english }}
            </div>
          </div>
        </div>

        <div class="detail-row">
          <div class="detail-icon">
            <i class="germany flag"></i>
          </div>

          <div class="detail-content">
            <div class="detail-label">German Word</div>
            <div class="detail-value">
              {{ word.german }}
            </div>
          </div>
        </div>
      </div>

      <div class="ui divider"></div>

      <div class="actions">
        <router-link
          :to="{ name: 'edit', params: { id: word._id } }"
          class="ui orange labeled icon button"
        >
          <i class="edit icon"></i>
          Edit Word
        </router-link>

        <button
          type="button"
          class="ui red labeled icon button"
          @click="onDestroy"
        >
          <i class="trash icon"></i>
          Delete Word
        </button>

        <router-link
          to="/words"
          class="ui basic labeled icon button"
        >
          <i class="left arrow icon"></i>
          Back to Main List
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped
src="../assets/show.css"></style>