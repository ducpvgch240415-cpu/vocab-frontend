<script setup lang="ts">
import { ref } from 'vue';

const testMessage = ref<string>('Vue Router is working perfectly!');
</script>

<template>
  <div>
    <h1>Test Component</h1>
    <p>{{ testMessage }}</p>
    <p>Use this component to test front-end layouts or isolated API requests before integrating them into the main app.</p>
  </div>
</template>