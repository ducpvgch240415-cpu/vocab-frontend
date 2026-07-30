<script setup lang="ts">
import { useVocabTest } from '../composable/useVocabTest';

const {cards, loading, error, questionCount, timerSeconds, fullTest, timerOptions, quizActive, quizFinished,
  quizQuestions, quizQuestionIndex, selectedOption, remainingTime, currentQuestion, score, quizDuration, startQuiz,
  handleAnswer, skipQuestion, resetQuiz, formatDuration, fetchWords
} = useVocabTest();

</script>

<template>
  <div class="self-test-page">
    <div class="ui raised segment test-panel">
      <div class="ui header page-header">
        <i class="question circle outline icon"></i>

        <div class="content">
          Self Test

          <div class="sub header">
            Test your vocabulary and review your results
          </div>
        </div>
      </div>

      <div class="ui divider"></div>

      <div v-if="loading" class="loading-state">
        <div class="ui active centered inline loader"></div>
        <p>Loading words...</p>
      </div>

      <div v-else-if="error" class="ui negative message">
        <i class="warning sign icon"></i>

        <div class="content">
          <div class="header">Unable to load the test</div>
          <p>{{ error }}</p>
        </div>
      </div>

      <div v-else-if="cards.length === 0" class="ui warning message">
        <i class="info circle icon"></i>

        <div class="content">
          <div class="header">No words available</div>
          <p>Add vocabulary words before starting a self test.</p>
        </div>
      </div>

      <section v-else class="quiz-wrap">
        <!-- Quiz setup -->
        <div
          v-if="!quizActive && !quizFinished"
          class="quiz-section quiz-setup"
        >
          <div class="section-heading">
            <div class="ui circular blue icon label">
              <i class="settings icon"></i>
            </div>

            <div>
              <h2>Practice Quiz</h2>
              <p>
                Select the number of questions and the total test time.
              </p>
            </div>
          </div>

          <form class="ui form" @submit.prevent="startQuiz">
            <div class="field">
              <label>Number of questions</label>

              <div class="ui left icon input">
                <input
                  v-model.number="questionCount"
                  type="number"
                  min="1"
                  :max="Math.min(20, cards.length)"
                  :disabled="fullTest"
                  placeholder="Enter number of questions"
                />

                <i class="list ol icon"></i>
              </div>
            </div>

            <div class="field test-all-field">
              <div class="ui checkbox">
                <input
                  id="full-test"
                  v-model="fullTest"
                  type="checkbox"
                />

                <label for="full-test">
                  Test every word in the database
                </label>
              </div>
            </div>

            <div class="field">
              <label>Time limit for the whole test</label>

              <select v-model.number="timerSeconds" class="ui dropdown">
                <option
                  v-for="option in timerOptions"
                  :key="option"
                  :value="option"
                >
                  {{
                    option === 0
                      ? 'Unlimited time'
                      : `${option} seconds`
                  }}
                </option>
              </select>
            </div>

            <div class="setup-summary">
              <div class="summary-item">
                <i class="tasks icon"></i>

                <div>
                  <span>Questions</span>
                  <strong>
                    {{ fullTest ? cards.length : questionCount }}
                  </strong>
                </div>
              </div>

              <div class="summary-item">
                <i class="clock outline icon"></i>

                <div>
                  <span>Time limit</span>
                  <strong>
                    {{
                      timerSeconds === 0
                        ? 'Unlimited'
                        : `${timerSeconds}s`
                    }}
                  </strong>
                </div>
              </div>
            </div>

            <button
              type="submit"
              class="ui fluid primary large labeled icon button"
            >
              <i class="play icon"></i>
              Start Quiz
            </button>
          </form>
        </div>

        <!-- Active question -->
        <div
          v-else-if="quizActive && currentQuestion"
          class="quiz-section quiz-question"
        >
          <div class="quiz-status">
            <div>
              <span class="status-label">Question</span>

              <strong>
                {{ quizQuestionIndex + 1 }}
                of
                {{ quizQuestions.length }}
              </strong>
            </div>

            <div
              class="timer"
              :class="{ urgent: timerSeconds > 0 && remainingTime <= 10 }"
            >
              <i class="clock outline icon"></i>

              {{
                timerSeconds > 0
                  ? `${remainingTime}s remaining`
                  : 'Unlimited time'
              }}
            </div>
          </div>

          <div class="ui tiny progress question-progress">
            <div
              class="bar"
              :style="{
                width: `${
                  ((quizQuestionIndex + 1) / quizQuestions.length) * 100
                }%
              `}"
            ></div>
          </div>

          <div class="question-content">
            <div class="question-label">Translate this word</div>

            <h2>{{ currentQuestion.prompt }}</h2>
          </div>

          <div class="answer-grid">
            <button
              v-for="option in currentQuestion.options"
              :key="option"
              type="button"
              class="ui basic answer-option button"
              :class="{
                selected:
                  selectedOption === option &&
                  !currentQuestion.selectedAnswer,

                positive:
                  currentQuestion.selectedAnswer &&
                  option === currentQuestion.correctAnswer,

                negative:
                  currentQuestion.selectedAnswer &&
                  option === currentQuestion.selectedAnswer &&
                  option !== currentQuestion.correctAnswer,
              }"
              :disabled="Boolean(currentQuestion.selectedAnswer)"
              @click="selectedOption = option"
            >
              <i
                v-if="
                  currentQuestion.selectedAnswer &&
                  option === currentQuestion.correctAnswer
                "
                class="check circle icon"
              ></i>

              <i
                v-else-if="
                  currentQuestion.selectedAnswer &&
                  option === currentQuestion.selectedAnswer &&
                  option !== currentQuestion.correctAnswer
                "
                class="times circle icon"
              ></i>

              {{ option }}
            </button>
          </div>

          <div class="question-actions">
            <button
              type="button"
              class="ui primary labeled icon button"
              :disabled="
                !selectedOption ||
                Boolean(currentQuestion.selectedAnswer)
              "
              @click="handleAnswer(selectedOption)"
            >
              <i class="check icon"></i>
              Submit Answer
            </button>

            <button
              type="button"
              class="ui basic labelled icon button"
              :disabled="Boolean(currentQuestion.selectedAnswer)"
              @click="skipQuestion"
            >
              <i class="forward icon"></i>
              Skip Question
            </button>
          </div>
        </div>

        <!-- Results -->
        <div v-else class="quiz-section quiz-results">
          <div class="results-header">
            <div
              class="ui circular icon label"
              :class="score >= quizQuestions.length / 2 ? 'green' : 'orange'"
            >
              <i class="trophy icon"></i>
            </div>

            <div>
              <h2>Quiz Complete</h2>
              <p>Review your score and each submitted answer.</p>
            </div>
          </div>

          <div class="result-summary">
            <div class="result-stat">
              <div class="value">
                {{ score }} / {{ quizQuestions.length }}
              </div>
              <div class="label">Score</div>
            </div>

            <div class="result-stat">
              <div class="value">
                {{
                  Math.round(
                    (score / quizQuestions.length) * 100
                  )
                }}%
              </div>
              <div class="label">Accuracy</div>
            </div>

            <div class="result-stat">
              <div class="value">
                {{ formatDuration(quizDuration) }}
              </div>
              <div class="label">Time Taken</div>
            </div>
          </div>

          <div class="ui divided relaxed list result-list">
            <div
              v-for="(item, index) in quizQuestions"
              :key="index"
              class="item result-item"
            >
              <div
                class="ui circular label result-number"
                :class="item.isCorrect ? 'green' : 'red'"
              >
                {{ index + 1 }}
              </div>

              <div class="content">
                <div class="header">
                  {{ item.prompt }}
                </div>

                <div class="description">
                  <div class="answer-line">
                    <span>Your answer</span>

                    <strong
                      :class="
                        item.isCorrect
                          ? 'correct-text'
                          : 'incorrect-text'
                      "
                    >
                      {{ item.selectedAnswer || 'Skipped' }}
                    </strong>
                  </div>

                  <div class="answer-line">
                    <span>Correct answer</span>
                    <strong>{{ item.correctAnswer }}</strong>
                  </div>
                </div>
              </div>

              <i
                :class="
                  item.isCorrect
                    ? 'green check circle icon'
                    : 'red times circle icon'
                "
              ></i>
            </div>
          </div>

          <div class="result-actions">
            <button
              type="button"
              class="ui primary labeled icon button"
              @click="startQuiz"
            >
              <i class="redo icon"></i>
              Try Again
            </button>

            <button
              type="button"
              class="ui basic labeled icon button"
              @click="resetQuiz"
            >
              <i class="settings icon"></i>
              Back to Setup
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped
src = "../assets/vocabtest.css"></style>
