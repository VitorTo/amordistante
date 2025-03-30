import { createRouter, createWebHistory } from 'vue-router'
import ProfileView from '../views/ProfileView.vue'
import HomeView from '../views/HomeView.vue'
import QuizzesView from '../views/QuizzesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
    },
    {
      path: '/quizzes',
      name: 'Quizzes',
      component: QuizzesView,
    },
  ],
})

export default router
