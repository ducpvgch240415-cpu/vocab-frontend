<script setup lang="ts">
import WordForm, { type Word } from '../components/WordForm.vue';
import { useRouter } from 'vue-router';
import { createWord, useFlash } from '../helpers/api';

const router = useRouter();
const { flash } = useFlash();

const createOrUpdate = async (word: Word) => {
  try {
    await createWord(word);
    flash('Word successfully created!', 'success');
    router.push('/words');
  } catch (error) {
    flash('Error creating word', 'error');
  }
};

</script>

<template>
  <div class="ui middle top aligned center aligned grid new-word-page">
    <div class="seven wide computer twelve wide tablet sixteen wide mobile column">

      <h1 class="ui center aligned header">
        New Word
      </h1>

      <WordForm @createOrUpdate="createOrUpdate" />

    </div>
  </div>
</template>

<style scoped>
.new-word-page {
  min-height: calc(100vh - 70px);
  padding: 3rem 1rem !important;
}

.ui.header {
  font-size: 2.6rem;
  margin-bottom: 2rem;
}
</style>

