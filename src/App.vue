 <script setup lang="ts">
import { ref } from 'vue';
import { useFlash } from './helpers/api';

defineOptions({
  name: 'App',
});

const { message, type } = useFlash();
const menuOpen = ref(false);

const closeMenu = () => {
  menuOpen.value = false;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="ui container header-content">
        <router-link
          to="/words"
          class="app-title"
          @click="closeMenu"
        >
          <i class="language icon"></i>
          VocabBuilder
        </router-link>

        <div class="menu-wrapper">
          <button
            type="button"
            class="ui inverted labeled icon button menu-button"
            @click="menuOpen = !menuOpen"
          >
            <i class="bars icon"></i>
            Menu
          </button>

          <div
            v-if="menuOpen"
            class="ui vertical menu dropdown-menu"
          >
            <router-link
              to="/words"
              class="item"
              @click="closeMenu"
            >
              <i class="book icon"></i>
              Words
            </router-link>

            <router-link
              to="/words/new"
              class="item"
              @click="closeMenu"
            >
              <i class="plus icon"></i>
              New Word
            </router-link>

            <router-link
              to="/flashcards"
              class="item"
              @click="closeMenu"
            >
              <i class="clone icon"></i>
              Flashcards
            </router-link>

            <router-link
              to="/self-test"
              class="item"
              @click="closeMenu"
            >
              <i class="question circle icon"></i>
              Self Test
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="ui container">
        <div
          v-if="message"
          class="ui message"
          :class="{
            positive: type === 'success',
            negative: type === 'error',
          }"
        >
          {{ message }}
        </div>

        <div class="page-wrapper">
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  background: #f8fafc;
}

.app-header {
  background: #1b1c1d;
}

.header-content {
  position: relative;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  min-height: 64px;
}

.app-title {
  color: white;
  font-size: 19px;
  font-weight: 700;
  text-decoration: none;
}

.app-title:hover {
  color: white;
}

.menu-wrapper {
  position: relative;
}

.menu-button.ui.button {
  margin: 0;
}

.dropdown-menu.ui.menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1000;
  min-width: 210px;
  margin: 0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
}

.dropdown-menu .item {
  display: flex;
  align-items: center;
  gap: 9px;
}

.dropdown-menu .item .icon {
  margin: 0;
}

.dropdown-menu .router-link-active {
  color: #2185d0 !important;
  font-weight: 700;
  background: #f3f4f6 !important;
}

.main-content {
  padding: 32px 0;
}

.page-wrapper {
  width: 100%;
}
</style>



