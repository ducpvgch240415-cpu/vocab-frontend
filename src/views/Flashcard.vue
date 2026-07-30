<script setup lang="ts">
import { flashcard } from '../composable/flashcard';

const { cards, index, flipped, loading, error, toggle, next, prev, shuffle, fetchWords } = flashcard();

</script>

<template>
  <div class="flashcards-page">
    <div class="ui raised segment flashcards-panel">
      <div class="ui header page-header">
        <i class="clone outline icon"></i>

        <div class="content">
          Flashcards

          <div class="sub header">
            Review your English and German vocabulary
          </div>
        </div>
      </div>

      <div class="ui divider"></div>

      <div class="ui compact message keyboard-hint">
        <i class="keyboard icon"></i>

        <div class="content">
          <strong>Keyboard:</strong>
          ← previous, → next, Space or F flip, R shuffle
        </div>
      </div>

      <div v-if="loading" class="ui active centered inline loader"></div>

      <div v-else-if="error" class="ui negative message">
        <i class="close icon"></i>

        <div class="content">
          <div class="header">Unable to load flashcards</div>
          <p>{{ error }}</p>
        </div>
      </div>

      <div v-else-if="cards.length === 0" class="ui warning message">
        <i class="info circle icon"></i>

        <div class="content">
          <div class="header">No vocabulary words found</div>
          <p>Add some words before using the flashcards.</p>
        </div>
      </div>

      <div v-else class="card-wrap">
        <div class="progress-row">
          <div class="card-number">
            Card {{ index + 1 }} of {{ cards.length }}
          </div>

          <div class="ui tiny indicating progress card-progress">
            <div
              class="bar"
              :style="{
                width: `${((index + 1) / cards.length) * 100}%`
              }"
            ></div>
          </div>
        </div>

        <div
          class="flashcard"
          role="button"
          tabindex="0"
          :aria-pressed="flipped"
          @click="toggle"
          @keydown.enter="toggle"
          @keydown.space.prevent="toggle"
        >
          <div class="card-inner" :class="{ flipped }">
            <div class="card-face card-front">
              <div class="language-label">
                <i class="uk flag"></i>
                English
              </div>

              <div class="word">
                {{ cards[index]?.english ?? '' }}
              </div>

              <div class="flip-help">
                <i class="sync alternate icon"></i>
                Click to show the German word
              </div>
            </div>

            <div class="card-face card-back">
              <div class="language-label">
                <i class="germany flag"></i>
                German
              </div>

              <div class="word">
                {{ cards[index]?.german ?? '' }}
              </div>

              <div class="flip-help">
                <i class="sync alternate icon"></i>
                Click to show the English word
              </div>
            </div>
          </div>
        </div>

        <div class="controls">
          <button
            type="button"
            class="ui basic labeled icon button"
            :disabled="cards.length <= 1"
            @click="prev"
          >
            <i class="left arrow icon"></i>
            Previous
          </button>

          <button
            type="button"
            class="ui primary labeled icon button"
            @click="toggle"
          >
            <i
              :class="flipped
                ? 'eye slash icon'
                : 'eye icon'"
            ></i>

            {{ flipped ? 'Hide Answer' : 'Show Answer' }}
          </button>

          <button
            type="button"
            class="ui basic right labeled icon button"
            :disabled="cards.length <= 1"
            @click="next"
          >
            Next
            <i class="right arrow icon"></i>
          </button>
        </div>

        <div class="secondary-controls">
          <button
            type="button"
            class="ui violet labeled icon button"
            :disabled="cards.length <= 1"
            @click="shuffle"
          >
            <i class="random icon"></i>
            Shuffle
          </button>

          <button
            type="button"
            class="ui basic teal labeled icon button"
            @click="fetchWords"
          >
            <i class="refresh icon"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped
src = "../assets/flashcard.css"></style>
