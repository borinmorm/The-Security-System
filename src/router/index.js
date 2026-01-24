import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import Loans from '../pages/Loans.vue'
import Applications from '../pages/Applications.vue'
import Borrowers from '../pages/Borrowers.vue'
import Reports from '../pages/Reports.vue'
import Settings from '../pages/Settings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/loans',
      name: 'Loans',
      component: Loans,
    },
    {
      path: '/applications',
      name: 'Applications',
      component: Applications,
    },
    {
      path: '/borrowers',
      name: 'Borrowers',
      component: Borrowers,
    },
    {
      path: '/reports',
      name: 'Reports',
      component: Reports,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
})

export default router
