 <script setup lang="ts">

defineOptions({
  name: 'App',
});

import { useFlash } from './helpers/api';
const { message, type } = useFlash();

</script>

<template>
  <!-- <div id="app">
    <nav class="navbar">
      <div class="nav-brand">VocabBuilder</div>
      <div class="nav-links">
        <router-link to="/words">Words</router-link>
        <router-link to="/words/new">New Word</router-link>
        <router-link to="/flashcards">Flashcards</router-link>
        <router-link to="/self-test">Self Test</router-link>
      </div>
    </nav>
  <div> 
    </div> -->
    <div class = "ui inverted segment navbar">
      <div class = "ui center aligned container">
      <div class = "ui large secondary inverted pointing menu compact">
        <router-link to="/words" class = "item" > <i class = "book icon"></i> Words </router-link>
        <router-link to="/words/new" class = "item"><i class = "plus icon"></i> New Word</router-link>
        <router-link to="/flashcards" class = "item"><i class = "clone icon"></i> Flashcards</router-link>
        <router-link to="/self-test" class = "item"><i class = "question circle icon"></i> Self Test</router-link>
      </div>
      
      </div>
    </div>

    <div class="ui container">
      <div class = "ui grid">
        <div class = "row" >
          <div class = "page-wrapper">
        <router-view />
      </div>
    </div>
  </div>
  </div>

</template>

<style scoped>
.page-wrapper {
  width: 100%;
}
</style>



