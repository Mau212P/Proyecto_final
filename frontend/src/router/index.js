// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CategoriesPage from '../views/CategoriesPage.vue'
import CartPage from '../views/CartPage.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/categorias',
    name: 'CategoriesPage',
    component: CategoriesPage
  },
  {
    path: '/carrito',
    name: 'CartPage',
    component: CartPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router