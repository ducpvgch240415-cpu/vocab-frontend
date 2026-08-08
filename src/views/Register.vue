<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api }  from '../helpers/api';

const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

const register = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    await api.post('/api/auth/register', {
      email: email.value,
      password: password.value,
    });

    success.value = 'Account created successfully';

    // Go to login after registration
    setTimeout(() => {
      router.push('/login');
    }, 1000);

  } catch (err: any) {
  console.log(err);
  console.log(err.response?.data);

  error.value =
    err.response?.data?.message ||
    'Registration failed';
}
};
</script>

<template>
  <div class="register-page">
    <div class="ui raised segment register-card">

      <h2 class="ui center aligned header">
        <i class="user plus icon"></i>

        <div class="content">
          Sign Up

          <div class="sub header">
            Create your vocabulary account
          </div>
        </div>
      </h2>

      <div class="ui divider"></div>

      <div
        v-if="error"
        class="ui negative message"
      >
        {{ error }}
      </div>

      <div
        v-if="success"
        class="ui positive message"
      >
        {{ success }}
      </div>

      <form
        class="ui form"
        :class="{ loading }"
        @submit.prevent="register"
      >
        <div class="field">
          <label>Email</label>

          <div class="ui left icon input">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />

            <i class="envelope icon"></i>
          </div>
        </div>

        <div class="field">
          <label>Password</label>

          <div class="ui left icon input">
            <input
              v-model="password"
              type="password"
              placeholder="Create a password"
              required
            />

            <i class="lock icon"></i>
          </div>
        </div>

        <button
          type="submit"
          class="ui primary fluid button"
        >
          <i class="user plus icon"></i>
          Sign Up
        </button>
      </form>

      <div class="ui horizontal divider">
        Already registered?
      </div>

      <router-link
        to="/login"
        class="ui basic fluid button"
      >
        Login
      </router-link>

    </div>
  </div>
</template>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  padding-top: 50px;
}

.register-card {
  width: 100%;
  max-width: 450px;
  padding: 28px !important;
}
</style>