import { ref } from 'vue';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
});

const message = ref<string>('');
const type = ref<'success' | 'error' | ''>('');

export async function getWords() {
  const response = await api.get('/words');
  return response.data;
}

export async function getWordById(id: string) {
  const response = await api.get(`/words/${id}`);
  return response.data;
}

export async function createWord(word: unknown) {
  const response = await api.post('/words', word);
  return response.data;
}

export async function updateWord(id: string, word: unknown) {
  const response = await api.put(`/words/${id}`, word);
  return response.data;
}

export async function deleteWord(id: string) {
  const response = await api.delete(`/words/${id}`);
  return response.data;
}

export function useFlash() {
  const flash = (msg: string, msgType: 'success' | 'error' = 'success') => {
    message.value = msg;
    type.value = msgType;

    setTimeout(() => {
      message.value = '';
    }, 3000);
  };

  return { message, type, flash };
}