<script setup lang="ts">
import { ref, watch } from 'vue';

export interface Word {
  _id?: string;
  english: string;
  german: string;
}

const props = withDefaults(
  defineProps<{
    word?: Word;
  }>(),
  {
    word: () => ({
      english: '',
      german: ''
    })
  }
);

const emit = defineEmits<{
  (e: 'createOrUpdate', word: Word): void;
}>();

const localWord = ref<Word>({ ...props.word });
const errorsPresent = ref(false);

watch(
  () => props.word,
  newVal => {
    localWord.value = { ...newVal };
    errorsPresent.value = false;
  },
  { deep: true }
);

const onSubmit = () => {
  const english = localWord.value.english.trim();
  const german = localWord.value.german.trim();

  if (!english || !german) {
    errorsPresent.value = true;
    return;
  }

  errorsPresent.value = false;

  emit('createOrUpdate', {
    ...localWord.value,
    english,
    german
  });
};
</script>

<template>
  <div class="ui raised segment word-form-card">
    <form class="ui form" @submit.prevent="onSubmit">
      <div
        v-if="errorsPresent"
        class="ui negative message"
        role="alert"
      >
        <i class="close icon" @click="errorsPresent = false"></i>

        <div class="header">
          Missing information
        </div>

        <p>Both English and German fields are required.</p>
      </div>

      <div
        class="field"
        :class="{
          error: errorsPresent && !localWord.english.trim()
        }"
      >
        <label for="english-word">English</label>

        <div class="ui left icon input">
          <input
            id="english-word"
            v-model="localWord.english"
            type="text"
            placeholder="Enter English word"
            autocomplete="off"
            @input="errorsPresent = false"
          />

          <i class="language icon"></i>
        </div>
      </div>

      <div
        class="field"
        :class="{
          error: errorsPresent && !localWord.german.trim()
        }"
      >
        <label for="german-word">German</label>

        <div class="ui left icon input">
          <input
            id="german-word"
            v-model="localWord.german"
            type="text"
            placeholder="Enter German translation"
            autocomplete="off"
            @input="errorsPresent = false"
          />

          <i class="translate icon"></i>
        </div>
      </div>

      <button
        type="submit"
        class="ui primary fluid large button"
      >
        <i :class="localWord._id ? 'save icon' : 'plus icon'"></i>

        {{ localWord._id ? 'Update word' : 'Add word' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.word-form-card {
  width: 100%;
  max-width: 560px;
  padding: 2rem !important;
  border: none !important;
  border-radius: 14px !important;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.08),
    0 2px 6px rgba(0, 0, 0, 0.04) !important;
}

.ui.form .field {
  margin-bottom: 1.5rem;
}

.ui.form .field > label {
  margin-bottom: 0.65rem;
  color: #1b1c1d;
  font-size: 0.95rem;
  font-weight: 600;
}

.ui.input {
  width: 100%;
}

.ui.input > input {
  min-height: 48px;
  padding-left: 3rem !important;
  border-radius: 8px !important;
  font-family: inherit;
  font-size: 1rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.ui.input > input:focus {
  border-color: #2185d0 !important;
  box-shadow: 0 0 0 3px rgba(33, 133, 208, 0.12) !important;
}

.ui.form .field.error input {
  background: #fff6f6 !important;
  border-color: #e0b4b4 !important;
  color: #9f3a38 !important;
}

.ui.form .field.error input:focus {
  box-shadow: 0 0 0 3px rgba(159, 58, 56, 0.1) !important;
}

.ui.primary.button {
  min-height: 48px;
  margin-top: 0.5rem;
  border-radius: 8px;
  font-weight: 600;
}

.ui.message {
  margin-bottom: 1.5rem;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .word-form-card {
    padding: 1.25rem !important;
  }
}
</style>