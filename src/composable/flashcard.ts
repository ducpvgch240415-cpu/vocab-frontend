import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getWords } from '../helpers/api';
import '../assets/flashcard.css';

export type LanguagePair = 'en-de' | 'de-fr' | 'en-fr';

type Card = {
  _id?: string;
  english: string;
  german: string;
  french: string;
};

const pairConfig: Record<LanguagePair, { left: keyof Card; right: keyof Card; leftLabel: string; rightLabel: string }> = {
  'en-de': {
    left: 'english',
    right: 'german',
    leftLabel: 'English',
    rightLabel: 'German',
  },
  'de-fr': {
    left: 'german',
    right: 'french',
    leftLabel: 'German',
    rightLabel: 'French',
  },
  'en-fr': {
    left: 'english',
    right: 'french',
    leftLabel: 'English',
    rightLabel: 'French',
  },
};

export function flashcard() {
  const cards = ref<Card[]>([]);
  const index = ref(0);
  const flipped = ref(false);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const selectedPair = ref<LanguagePair>('en-de');

  const pairOptions = Object.entries(pairConfig).map(([value, config]) => ({
    value: value as LanguagePair,
    label: `${config.leftLabel} ⇄ ${config.rightLabel}`,
  }));

  const currentPair = computed(() => pairConfig[selectedPair.value]);

  const getCardPair = (card: Card | null | undefined) => {
    const config = pairConfig[selectedPair.value];
    if (!card) {
      return {
        frontLabel: config.leftLabel,
        backLabel: config.rightLabel,
        frontValue: '',
        backValue: '',
      };
    }

    return {
      frontLabel: config.leftLabel,
      backLabel: config.rightLabel,
      frontValue: card[config.left] ?? '',
      backValue: card[config.right] ?? '',
    };
  };

  const fetchWords = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await getWords();
      cards.value = data.map((w: any) => ({
        _id: w._id,
        english: w.english ?? '',
        german: w.german ?? '',
        french: w.french ?? '',
      }));
      index.value = 0;
    } catch (err: any) {
      error.value = err.message || String(err);
    } finally {
      loading.value = false;
    }
  };

  function setPair(pair: LanguagePair) {
    selectedPair.value = pair;
    flipped.value = false;
    index.value = 0;
  }

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

  return {
    cards,
    index,
    flipped,
    loading,
    error,
    selectedPair,
    pairOptions,
    currentPair,
    getCardPair,
    fetchWords,
    setPair,
    next,
    prev,
    toggle,
    shuffle,
    handleKey,
  };
}
