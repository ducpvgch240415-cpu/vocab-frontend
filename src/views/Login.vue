<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../helpers/api';
import { isLoggedIn } from '../helpers/auth';

const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
declare const google: any;

const login = async () => {
  try {
    await api.post('/api/auth/login', {
      email: email.value,
      password: password.value
    });

    const meResponse = await api.get('/api/auth/me');
    isLoggedIn.value = Boolean(meResponse.data?.loggedIn);

    router.push('/words');
  } catch {
    error.value = 'Invalid email or password';
  }
};

onMounted(() => {
  google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

    callback: async (response: any) => {
      await api.post('/api/auth/google', {
        credential: response.credential,
      });

      const meResponse = await api.get('/api/auth/me');
      isLoggedIn.value = Boolean(meResponse.data?.loggedIn);
      router.push('/words');
    },
  });

  google.accounts.id.renderButton(
    document.getElementById('google-button'),
    {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
    }
  );
});

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log(
  'Google Client ID:',
  import.meta.env.VITE_GOOGLE_CLIENT_ID
);
</script>

<template>
  <div class="ui raised segment">
    <h2 class="ui header">Login</h2>

    <form class="ui form" @submit.prevent="login">

  <div class="field">
    <label>Email</label>
    <input
      v-model="email"
      type="email"
      required
    />
  </div>

  <div class="field">
    <label>Password</label>
    <input
      v-model="password"
      type="password"
      required
    />
  </div>

  <div v-if="error" class="ui negative message">
    {{ error }}
  </div>

  <button
    type="submit"
    class="ui primary fluid button"
  >
    Login
  </button>

  <div class="ui horizontal divider">
    OR
  </div>

  <div id="google-button"></div>

  <div class="ui horizontal divider">
    New user?
  </div>

  <router-link
    to="/register"
    class="ui basic fluid button"
  >
    Sign Up
  </router-link>

</form>
  </div>
  
</template>