<script setup lang="ts">
import { ref, onMounted } from 'vue';
import WordForm, { type Word } from '../components/WordForm.vue';
import { useRouter, useRoute } from 'vue-router';
import { getWordById, updateWord, useFlash } from '../helpers/api';

const router = useRouter();
const route = useRoute();
const { flash } = useFlash();

const word = ref<Word>({ english: '', german: '' });

onMounted(async () => {
  const id = route.params.id as string;
  word.value = await getWordById(id);
});

const createOrUpdate = async (updatedWord: Word) => {
  try {
    const id = route.params.id as string;
    await updateWord(id, updatedWord);
    flash('Word updated successfully!', 'success');
    router.push('/words');
  } catch (error) {
    flash('Error updating word', 'error');
  }
};
</script>

<template>
  <div class="edit-page">
    <div class="ui raised segment edit-card">
      <div class="ui header edit-header">
        <i class="edit outline icon"></i>

        <div class="content">
          Edit Word

          <div class="sub header">
            Update the English and German vocabulary values
          </div>
        </div>
      </div>

      <div class="ui divider"></div>

      <WordForm class = "wordform"
        :word="word"
        @createOrUpdate="createOrUpdate"
      />

      <div class="ui divider"></div>

      <div class="bottom-actions">
        <router-link
          :to="{ name: 'show', params: { id: word._id } }"
          class="ui basic labeled icon button"
        >
          <i class="left arrow icon"></i>
          Back to Details
        </router-link>

        <router-link
          to="/words"
          class="ui basic grey labeled icon button"
        >
          <i class="list icon"></i>
          Word List
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-page {
  width: 100%;
  max-width: 760px;
  margin: 40px auto;
  padding: 0 20px;
}

.edit-card.ui.segment {
  padding: 30px;
  border: none;
  border-radius: 14px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.09);
}

.edit-header.ui.header {
  margin: 0;
  font-size: 30px;
}

.edit-header.ui.header > .icon {
  color: #2185d0;
}

.edit-header .sub.header {
  margin-top: 7px;
  color: #6b7280;
  font-size: 15px;
  font-weight: 400;
}

.edit-card .ui.divider {
  margin: 24px 0;
}

.bottom-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.bottom-actions .ui.button {
  margin: 0;
}

@media (max-width: 600px) {
  .edit-page {
    margin: 24px auto;
    padding: 0 14px;
  }

  .edit-header.ui.header {
    font-size: 25px;
  }

  .bottom-actions {
    flex-direction: column;
  }

}
.wordform {
  left: 50px;
}
</style>