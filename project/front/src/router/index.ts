import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import ArticlesList from '@/components/ArticlesList.vue';
import { userStore } from '@/core/stores/userStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesList,
    },
  ]
})


router.beforeEach(async (to, _, next) => {
  const usuarioStore = userStore();

  const errorPages = ["/403", "/404", "/500"];
  const publicPages: string[] = ["/logout", "/"];
  const isError = errorPages.includes(to.path);
  const isPublic = publicPages.includes(to.path);
  const isLogged = usuarioStore.data.isAuthenticated;
  if (!isLogged && !isPublic && !isError) {
    next({ name: 'login' });
  } else if (isLogged && isPublic) {
    next({ path: "/articles" });
  } else {
    next();
  }
});
export default router
