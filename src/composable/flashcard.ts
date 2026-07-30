import { onBeforeUnmount, onMounted, ref } from 'vue';
import { getWords } from '../helpers/api';
import '../assets/flashcard.css';
export function flashcard() {
type Card = { _id?: string; english: string; german: string };

const cards = ref<Card[]>([]);
const index = ref(0);
const flipped = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchWords = async () => {
  loading.value = true;
  error.value = null;
  try {
    const data = await getWords();
    cards.value = data.map((w: any) => ({ _id: w._id, english: w.english, german: w.german }));
    index.value = 0;
  } catch (err: any) {
    error.value = err.message || String(err);
  } finally {
    loading.value = false;
  }
};

function next() {
  flipped.value = false;
  if (cards.value.length === 0) return;
  index.value = (index.value + 1) % cards.value.length;
}

function prev() {
  flipped.value = false;
  if (cards.value.length === 0) return;
  index.value = (index.value - 1 + cards.value.length) % cards.value.length;
}

function toggle() {
  flipped.value = !flipped.value;
}

function shuffle() {
  if (cards.value.length === 0) return;
  for (let i = cards.value.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = cards.value[i];
    const target = cards.value[j];
    if (current && target) {
      [cards.value[i], cards.value[j]] = [target, current];
    }
  }
  index.value = 0;
  flipped.value = false;
}

function handleKey(e: KeyboardEvent) {
  const key = e.key.toLowerCase();
  if (e.code === 'ArrowRight') {
    next();
  } else if (e.code === 'ArrowLeft') {
    prev();
  } else if (e.code === 'Space') {
    e.preventDefault();
    toggle();
  } else if (key === 'f') {
    toggle();
  } else if (key === 'r') {
    shuffle();
  }
}

onMounted(() => {
  fetchWords();
  window.addEventListener('keydown', handleKey);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKey);
});
return{
    cards,
    index,
    flipped,
    loading,
    error,
    fetchWords,
    next,
    prev,
    toggle,
    shuffle,
    handleKey
}
}