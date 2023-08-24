<template>
  <div>
    <Heading/>
  </div>
  <div class="main-body">
    <div class="w-1/3 lg:w-2/3 h-full pr-4 pl-1">
      <div class="relative h-full rounded-lg overflow-hidden">
        <Visualization :selectedScenario="selectedScenario"/>
      </div>
    </div>
    <div class="w-2/3 lg:w-1/3 h-full text-center bg-white ring-1 ring-slate-900/5 rounded-lg shadow-md">
      <div class="text-text-100 px-5 py-6 w-full h-full">
        <div class="grid grid-rows-5 gap-3 h-full w-full text-start">
          <div class="row-span-1 px-1">
            <label for="scenarios" class="block mb-2 text-sm font-medium text-text-200">Select a scenario and number of iterations</label>
            <div class="flex">
              <!-- scenario selection -->
              <select id="scenarios" v-model="selectedScenario" class="big-dropdown-list mr-4">
                <option value="ori" selected>Base Scenario</option>
                <option v-for="scenario in scenarios" :key="scenario._id" :value="scenario._id">{{ scenario._id }}</option>
              </select>
              <!-- iterations selection -->
              <div class="mr-4">
                <input @keypress="isInteger" id="iters" type="number" min="1" placeholder="Iters" required v-model="iters" class="text-input px-4 py-3 w-full">
              </div>
              <!-- run button -->
              <button @click="handleRun" class="button">Run</button>
            </div>
            <p ref="itersError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
              
          </div>
          <div class="row-span-4 overflow-y-auto px-1">
            <div v-for="scenario in scenarios" :key="scenario._id">
              <RecommendationsCard :title="scenario._id"/>
            </div>
          </div>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import { onMounted, ref, watch, watchEffect } from "vue"
import Heading from '../components/Heading'
import Visualization from "../components/Visualization"
import RecommendationsCard from '../components/RecommendationsCard'
import getScenarios from "../composables/getScenarios"
import run from "../composables/run"

export default {
  name: 'HomeView',
  components: { Heading, Visualization, RecommendationsCard },
  setup() {
    const { scenarios, error: loadScenariosError, load: loadScenarios } = getScenarios()
    const { res: runRes, error: runError, post: runMatsim } = run()

    const isInteger = (e) => {
        if (e.code.includes('Digit')) {
          return true
        } else {
            e.preventDefault()
        }
    }

    // run matsim refs

    const selectedScenario = ref('ori')
    const iters = ref(100)

    // run matsim errors

    const itersError = ref(null)


    // run matsim functions

    const handleRun = async() => {
      if (iters.value > 0) {
        itersError.value.classList.add('invisible')

        await runMatsim(selectedScenario.value, iters.value)

      } else {
        itersError.value.innerHTML = 'Number of iterations must be a positive integer'
        itersError.value.classList.remove('invisible')
      }
      
    }

    loadScenarios()

    return { scenarios, selectedScenario, iters, itersError, isInteger, handleRun }
  }
}
</script>
