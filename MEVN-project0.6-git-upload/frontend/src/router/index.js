import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'
import ScenariosView from '../views/scenarios/ScenariosView.vue'
import ScenarioDetailsView from '../views/scenarios/ScenarioDetailsView.vue'
import AddScenarioView from '../views/scenarios/AddScenarioView.vue'
import AddLineView from '../views/scenarios/lines/AddLineView.vue'
import EditLineView from '../views/scenarios/lines/EditLineView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView
  },
  {
    path: '/scenarios',
    name: 'Scenarios',
    component: ScenariosView
  },
  {
    path: '/scenarios/:id',
    name: 'Scenario Details',
    component: ScenarioDetailsView,
    props: true
  },
  {
    path: '/add-scenario',
    name: 'Add New Scenario',
    component: AddScenarioView
  },
  {
    path: '/add-line',
    name: 'Add New Line',
    component: AddLineView
  },
  {
    path: '/edit-line/:id',
    name: 'Edit Line',
    component: EditLineView
  },
  // redirect
  {
    path: '/home',
    redirect: '/'
  },
  // catchall 404
  {
    path: '/:catchAll(.*)',
    name: 'Not Found',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
