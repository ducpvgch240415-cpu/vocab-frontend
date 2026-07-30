import { createRouter, createWebHistory } from 'vue-router'

import Words from '../views/Words.vue'
import Show from '../views/Show.vue'
import Edit from '../views/Edit.vue'
import New from '../views/New.vue'
import Flashcard from '../views/Flashcard.vue'
import VocabTest from '../views/VocabTest.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/words',
    },
    {
      path: '/words',
      name: 'words',
      component: Words,
    },
    {
      path: '/flashcards',
      name: 'flashcards',
      component: Flashcard,
    },
    {
      path: '/self-test',
      name: 'self-test',
      component: VocabTest,
    },
    {
      path: '/words/new',
      name: 'new-word',
      component: New,
    },
    {
      path: '/words/:id',
      name: 'show',
      component: Show,
    },
    {
      path: '/words/:id/edit',
      name: 'edit',
      component: Edit,
    },
  ],
})

export default router
