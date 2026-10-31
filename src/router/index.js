// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import StartseiteView from '../views/StartseiteView.vue'
import UeberMichView from '../views/UeberMichView.vue'
import GallerieView from '@/views/GallerieView.vue'
import SchnittmusterView from '@/views/SchnittmusterView.vue'
import LangarmshirtView from '@/views/LangarmshirtView.vue'
import MessenView from '@/views/MessenView.vue'
import Messen1 from '@/views/Messen1.vue'
import ProfilView from '@/views/ProfilView.vue'
import Messen2 from '@/views/Messen2.vue'
import LoginView from '@/views/LoginView.vue'
import Messen3 from '@/views/Messen3.vue'
import RegistrierenView from '@/views/RegistrierenView.vue'

import DatenschutzView from '@/views/DatenschutzView.vue'
import ImpressumView from '@/views/ImpressumView.vue'

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
      path: '/langarmshirt',
      name: 'langarmshirt',
      component: LangarmshirtView
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
      path: '/messen3',
      name: 'messen3',
      component: Messen3
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/registrieren',
      name: 'registrieren',
      component: RegistrierenView
    },
    {
      path: '/profil',
      name: 'profil',
      component: ProfilView
    },
    {
      path: '/datenschutz',
      name: 'datenschutz',
      component: DatenschutzView
    },
  {
    path: '/impressum',
    name: 'impressum',
    component: ImpressumView
  }
  ]
})

export default router