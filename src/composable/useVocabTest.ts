import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getWords } from '../helpers/api';
import '../assets/vocabtest.css';

export type LanguagePair = 'en-de' | 'de-fr' | 'en-fr';

type Card = { _id?: string; english: string; german: string; french: string };

type QuizQuestion = {
  prompt: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  skipped: boolean;
  timeTaken: number;
};

const pairConfig: Record<LanguagePair, { left: keyof Card; right: keyof Card; leftLabel: string; rightLabel: string }> = {
  'en-de': { left: 'english', right: 'german', leftLabel: 'English', rightLabel: 'German' },
  'de-fr': { left: 'german', right: 'french', leftLabel: 'German', rightLabel: 'French' },
  'en-fr': { left: 'english', right: 'french', leftLabel: 'English', rightLabel: 'French' },
};

export function useVocabTest() {
  const cards = ref<Card[]>([]);
  const loading = ref(true);
  const error = ref<string | null>(null);
  const questionCount = ref(5);
  const timerSeconds = ref(20);
  const fullTest = ref(false);
  const quizActive = ref(false);
  const quizFinished = ref(false);
  const quizQuestions = ref<QuizQuestion[]>([]);
  const quizQuestionIndex = ref(0);
  const selectedOption = ref<string | null>(null);
  const remainingTime = ref(0);
  const quizStartedAt = ref<number | null>(null);
  const quizFinishedAt = ref<number | null>(null);
  const timerId = ref<number | null>(null);
  const questionStartedAt = ref<number | null>(null);
  const selectedPair = ref<LanguagePair>('en-de');

  const timerOptions = [0, 15, 20, 30, 45, 60];
  const pairOptions = Object.entries(pairConfig).map(([value, config]) => ({
    value: value as LanguagePair,
    label: `${config.leftLabel} ⇄ ${config.rightLabel}`,
  }));

  const currentQuestion = computed(() => quizQuestions.value[quizQuestionIndex.value] ?? null);
  const score = computed(() => quizQuestions.value.filter((item) => item.isCorrect).length);
  const quizDuration = computed(() => {
    if (!quizStartedAt.value || !quizFinishedAt.value) return 0;
    return Math.max(1, Math.round((quizFinishedAt.value - quizStartedAt.value) / 1000));
  });

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
      if (quizActive.value) {
        quizActive.value = false;
        quizFinished.value = false;
        quizQuestions.value = [];
        clearTimer();
      }
    } catch (err: any) {
      error.value = err.message || String(err);
    } finally {
      loading.value = false;
    }
  };

  function clearTimer() {
    if (timerId.value) {
      window.clearInterval(timerId.value);
      timerId.value = null;
    }
  }

  function startQuizTimer() {
    clearTimer();
    if (timerSeconds.value <= 0) {
      remainingTime.value = 0;
      return;
    }

    remainingTime.value = timerSeconds.value;
    timerId.value = window.setInterval(() => {
      remainingTime.value -= 1;
      if (remainingTime.value <= 0) {
        clearTimer();
        handleAnswer(null, true);
      }
    }, 1000);
  }

  function setPair(pair: LanguagePair) {
    selectedPair.value = pair;
    if (quizActive.value) {
      startQuiz();
    }
  }

  function startQuiz() {
    if (cards.value.length === 0) return;

    const requestedCount = fullTest.value ? cards.value.length : Math.max(1, Number(questionCount.value) || 5);
    const quizPool: Card[] = [];
    const config = pairConfig[selectedPair.value];

    while (quizPool.length < requestedCount) {
      const randomCard = cards.value[Math.floor(Math.random() * cards.value.length)];
      if (randomCard) {
        quizPool.push(randomCard);
      }
    }

    quizQuestions.value = quizPool.map((card) => {
      const reverse = Math.random() > 0.5;
      const sourceField = reverse ? config.right : config.left;
      const targetField = reverse ? config.left : config.right;
      const sourceLabel = reverse ? config.rightLabel : config.leftLabel;
      const targetLabel = reverse ? config.leftLabel : config.rightLabel;
      const prompt = `What is the ${targetLabel} translation of "${card[sourceField] ?? ''}"?`;
      const correctAnswer = card[targetField] ?? '';
      const distractors = cards.value
        .filter((item) => item._id !== card._id)
        .map((item) => item[targetField] ?? '')
        .filter((item) => item && item !== correctAnswer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [correctAnswer, ...distractors]
        .filter((item) => item)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      if (options.length < 2) {
        options.push(correctAnswer);
      }

      return {
        prompt,
        options,
        correctAnswer,
        selectedAnswer: null,
        isCorrect: null,
        skipped: false,
        timeTaken: 0,
      };
    });

    quizActive.value = true;
    quizFinished.value = false;
    quizQuestionIndex.value = 0;
    selectedOption.value = null;
    quizStartedAt.value = Date.now();
    quizFinishedAt.value = null;
    questionStartedAt.value = Date.now();
    startQuizTimer();
  }

  function handleAnswer(answer: string | null, timedOut = false) {
    const question = quizQuestions.value[quizQuestionIndex.value];
    if (!question) return;

    const isCorrect = answer !== null && answer === question.correctAnswer;
    const questionTime = questionStartedAt.value ? Math.max(1, Math.round((Date.now() - questionStartedAt.value) / 1000)) : 1;

    question.selectedAnswer = answer;
    question.isCorrect = isCorrect;
    question.skipped = timedOut || answer === null;
    question.timeTaken = timerSeconds.value > 0 ? questionTime : 0;

    if (timedOut) {
      quizActive.value = false;
      quizFinished.value = true;
      quizFinishedAt.value = Date.now();
      clearTimer();
      return;
    }

    if (quizQuestionIndex.value < quizQuestions.value.length - 1) {
      quizQuestionIndex.value += 1;
      selectedOption.value = null;
      questionStartedAt.value = Date.now();
    } else {
      quizActive.value = false;
      quizFinished.value = true;
      quizFinishedAt.value = Date.now();
      clearTimer();
    }
  }

  function skipQuestion() {
    handleAnswer(null);
  }

  function resetQuiz() {
    clearTimer();
    quizActive.value = false;
    quizFinished.value = false;
    quizQuestions.value = [];
    quizQuestionIndex.value = 0;
    selectedOption.value = null;
    quizStartedAt.value = null;
    quizFinishedAt.value = null;
  }

  function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  onMounted(() => {
    fetchWords();
  });

  onBeforeUnmount(() => {
    clearTimer();
  });

  return {
    cards,
    loading,
    error,
    questionCount,
    timerSeconds,
    fullTest,
    timerOptions,
    selectedPair,
    pairOptions,
    quizActive,
    quizFinished,
    quizQuestions,
    quizQuestionIndex,
    selectedOption,
    remainingTime,
    currentQuestion,
    score,
    quizDuration,
    startQuiz,
    handleAnswer,
    skipQuestion,
    resetQuiz,
    formatDuration,
    fetchWords,
    setPair,
  };
}

