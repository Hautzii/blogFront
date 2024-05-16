import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/post/:id/:title',
      name: 'PostView',
      component: () => import('../views/PostView.vue')
    },
    {
      path: '/edit/:id/:title',
      name: 'EditView',
      component: () => import('../views/EditView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

const publicPages = ['/login', '/register', '/'];

router.beforeEach(async (to, from, next) => {
  // check if the route requires authentication
  const authRequired = !to.path.startsWith('/post/') && !publicPages.includes(to.path);
  const adminRequired = to.path.includes('/edit/');

  // check if the user is authenticated and if they are an admin
  let loggedIn = false;
  let isAdmin = false;
  try {
    const response = await axios.get('http://localhost:8000/api/user');
    loggedIn = true;
    isAdmin = response.data.is_admin;
  } catch (error) {
    loggedIn = false;
  }

  // if the route requires authentication and the user is not authenticated, redirect to login page
  // if the route requires admin access and the user is not an admin, redirect to login page
  if ((authRequired && !loggedIn) || (adminRequired && !isAdmin)) {
    next('/login');
  } else {
    next();
  }
});

export default router