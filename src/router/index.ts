import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/home.vue';
import lineGraph from '@/components/lineGraph.vue';
import test from '@/components/test.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  { path: '/lineGraph', name: 'lineGraph', component: lineGraph },
  { path: '/test', name: 'test', component: test }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
export default router;
