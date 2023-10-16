import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/home.vue';
import lineGraph from '@/components/lineGraph.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  { path: '/lineGraph', name: 'lineGraph', component: lineGraph }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
