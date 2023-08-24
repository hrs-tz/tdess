<template>
    <div>
        <Heading @search="(value) => filteredScenarios = scenarios.filter(scenario => scenario._id.includes(value))"/>
    </div>
    <div class="main-body">
        <div class="h-full overflow-y-auto w-full p-1">
            <div v-if="error">
                <p>{{ error }}</p>
            </div>
            <div v-else-if="filteredScenarios" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <router-link :to="{ name: 'Add New Scenario' }">
                
                    <ScenarioCard title="Add new scenario" body='<i-plus>'/>

                </router-link>
                <div v-for="scenario in filteredScenarios" :key="scenario._id" class="">
                    <div v-if="scenario.score === -1">
                        <ScenarioCard @delete="handleDelete(scenario._id)" :title="scenario._id" :body="scenario.description" badge="no score" :actions="true"/>
                    </div>
                    <div v-else>
                        <ScenarioCard @delete="handleDelete(scenario._id)" :title="scenario._id" :body="scenario.description" :badge="scenario.score" :actions="true"/>
                    </div>
                </div>
            </div>
            <div v-else-if="scenarios.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                
                <router-link :to="{ name: 'Add New Scenario' }">
                    <ScenarioCard title="Add new scenario" body='<i-plus>'/>
                </router-link>

                <!-- </router-link> -->
                <div v-for="scenario in scenarios" :key="scenario._id" class="">
                    <div v-if="scenario.score === -1">
                        <ScenarioCard @delete="handleDelete(scenario._id)" :title="scenario._id" :body="scenario.description" badge="no score" :actions="true"/>
                    </div>
                    <div v-else>
                        <ScenarioCard @delete="handleDelete(scenario._id)" :title="scenario._id" :body="scenario.description" :badge="scenario.score" :actions="true"/>
                    </div>
                </div>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                <router-link :to="{ name: 'Add New Scenario' }">
                    <ScenarioCard title="Add new scenario" body='<i-plus>'/>
                </router-link>
            </div>    
        </div>
        
    </div>
    
</template>

<script>
import { ref } from 'vue'
import getScenarios from '../../composables/getScenarios'
import deleteScenario from '../../composables/deleteScenario'
import ScenarioCard from '../../components/ScenarioCard'
import Heading from '../../components/Heading'

export default {
    name: 'ScenariosView',
    components: { ScenarioCard, Heading },
    setup() {
        // load all scenarios
        const { scenarios, error, load } = getScenarios()
        const filteredScenarios = ref(null)

        // delete a scenario
        const { res, error: deleteError, remove } = deleteScenario()
        const handleDelete = async (scenarioId) => {
            await remove(scenarioId)

            if (!deleteError.value) {
                load()
            } else {
                // generic error
                console.log(deleteError.value)
            }

        }

        load()

        return { scenarios, error, filteredScenarios, handleDelete }
    }
}

</script>

<style>
    .scenario {
        background: #F0F0F0;
        padding: 20px;
        border-radius: 10px;
        margin: 10px auto;
        width: 300px;
        color: #707070;
    }
    .scenario:hover {
        background: #ddd;
    }
    .scenario h2 {
        cursor: default;
        color: #484848;
    }
    .scenario p {
        cursor: default;
        color: #707070;
    }
    .scenario a {
        text-decoration: none;
    }
</style>