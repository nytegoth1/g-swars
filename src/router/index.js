import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import UserDetails from '../components/UserDetails.vue';

// Define routes
const routes = [
  { path: '/', component: Home },
  { path: '/user/:id', component: UserDetails, props: true }, // Dynamic route for user details
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
