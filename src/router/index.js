// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import StartseiteView from '../views/StartseiteView.vue'
import UeberMichView from '../views/UeberMichView.vue'
import GallerieView from '@/views/GallerieView.vue'
import SchnittmusterView from '@/views/SchnittmusterView.vue'
import MessenView from '@/views/MessenView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'startseite',
      component: StartseiteView
    },
    {
      path: '/ueber-mich',
      name: 'ueber-mich',
      component: UeberMichView
    },
    {
        path: '/gallerie',
        name: 'gallerie',
        component: GallerieView
    },
    {
      path: '/schnittmuster',
      name: 'schnittmuster',
      component: SchnittmusterView
    },
    {
      path: '/messen',
      name: 'messen',
      component: MessenView
    },
  ]
})

export default router