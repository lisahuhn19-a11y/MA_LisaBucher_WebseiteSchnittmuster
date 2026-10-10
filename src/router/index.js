// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import StartseiteView from '../views/StartseiteView.vue'
import UeberMichView from '../views/UeberMichView.vue'
import GallerieView from '@/views/GallerieView.vue'
import SchnittmusterView from '@/views/SchnittmusterView.vue'
import MessenView from '@/views/MessenView.vue'
import Messen1 from '@/views/Messen1.vue'
import ProfilView from '@/views/ProfilView.vue'
import Messen2 from '@/views/Messen2.vue'
import LoginView from '@/views/LoginView.vue'

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
    {
      path: '/messen1',
      name: 'messen1',
      component: Messen1
    },
    {
      path: '/messen2',
      name: 'messen2',
      component: Messen2
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilView
    }
  ]
})

export default router