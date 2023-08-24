<template>
    <div>
        <Heading @save="handleSave" @edit="editable = true; newDescription = scenario.description" @cancel="editable = false; newDescription = ''" :editEnabled="editable" :process="processing"/>
    </div>
    <div class="main-body">
        <div class="w-1/4 h-full pr-2 pl-1">
            <div v-if="error">
                <p>{{ error }}</p>
            </div>
            <div v-if="scenario" class="h-full flex flex-col">
                <div class="grid grid-cols-1 lg:grid-cols-2">
                    <h1 class="pb-2 text-text-200 text-2xl font-medium lg:col-span-2 flex">{{ scenario._id }}</h1>
                    <div class="border border-gray-200 rounded-lg p-2 text-text-100 mt-2 lg:mr-2">
                        <p class="text-sm">Score</p>
                        <div v-if="scenario.score === -1">
                            <p class="text-text-200">-</p>
                        </div>
                        <div v-else>
                            <p class="text-text-200">{{ scenario.score }}</p>
                        </div>
                    </div>
                    <div class="border border-gray-200 rounded-lg p-2 text-text-100 mt-2">
                        <p class="text-sm">Average Travel Time</p>
                        <div v-if="scenario.score === -1">
                            <p class="text-text-200">-</p>
                        </div>
                        <div v-else>
                            <p class="text-text-200">{{ scenario.avgTravelTime }}</p>
                        </div>
                    </div>
                    <div class="border border-gray-200 rounded-lg p-2 text-text-100 my-2 lg:mr-2">
                        <p class="text-sm">Average Transits</p>
                        <div v-if="scenario.score === -1">
                            <p class="text-text-200">-</p>
                        </div>
                        <div v-else>
                            <p class="text-text-200">{{ scenario.avgTransits }}</p>
                        </div>
                    </div>
                    <div class="border border-gray-200 rounded-lg p-2 text-text-100 mb-2 lg:my-2">
                        <p class="text-sm">Number of Vehicles</p>
                        <div v-if="scenario.score === -1">
                            <p class="text-text-200">-</p>
                        </div>
                        <div v-else>
                            <p class="text-text-200">{{ scenario.numberOfVehicles }}</p>
                        </div>
                    </div>
                </div>
                    <div class="border border-gray-200 rounded-lg p-2 text-text-100 h-full overflow-hidden">
                        <div v-if="editable">
                            <p class="text-sm text-primary-100">Description</p>
                            <textarea v-model="newDescription" name="description" id="description" cols="30" rows="10" class="resize-none w-full h-full outline-none"></textarea>
                            <p ref="descriptionError" class="invisible text-red-700 lg:col-span-2 flex text-xs font-medium">error</p>
                        </div>
                        <div v-else class="h-full overflow-y-auto">
                            <p class="text-sm">Description</p>
                            <p class="text-text-200">{{ scenario.description }}</p>
                        </div>
                    </div>
            </div>
            <div v-else class="h-full">
                <div class="h-full animate-pulse flex justify-center items-center">
                    <p>Loading lines...</p>
                </div>
            </div>
        </div>
        <div class="w-1/2 h-full px-4 overflow-y-auto">
            <div class="h-96">
                <div class="pb-4 text-text-200 flex items-center justify-between">
                    <h1 class="text-2xl font-medium">Lines</h1>
                    <i @click="$router.push({ name: 'Add New Line', query: {scenarioId: scenario._id} })" class="fa-solid fa-plus mr-3.5"></i>
                </div>
                <div v-if="filteredLines">
                    <div v-for="line in filteredLines" :key="line.id" class="pb-2 text-text-200">
                        <div class="group relative">
                            <details class="group bg-white ring-1 ring-slate-900/5 shadow-md group-hover:bg-primary-100 group-hover:ring-primary-100 group-hover:text-white rounded-lg p-4">
                                <summary class="list-none flex flex-wrap items-center">
                                    <p>{{ line.id }}</p>
                                </summary>
                                <div class="pt-4">
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Type:</p>
                                        <div class="flex">
                                            <div v-for="type in line.type" :key="type">
                                                <div v-if="type === 'pt'">
                                                    <p class="text-sm font-medium">Bus</p>
                                                </div>
                                                <div v-else>
                                                    <p class="text-sm font-medium capitalize">{{ type }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Stops:</p>
                                        <p class="text-sm font-medium">{{ line.stops }}</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Departures:</p>
                                        <p class="text-sm font-medium">{{ line.departures }}</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Routes:</p>
                                        <p class="text-sm font-medium">{{ line.routesSize }}</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Number Of Vehicles:</p>
                                        <p class="text-sm font-medium">{{ line.numberOfVehicles }}</p>
                                    </div>
                                </div>
                            </details>
                            <div class="actions pt-3 group-hover:text-white">
                                <i @click="$router.push({ name: 'Edit Line', params: { id: line._id } })" class="fa-solid fa-pen-to-square pr-5"></i>
                                <i @click="handleDelete(line.id)" class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="lines">
                    <div v-for="line in lines" :key="line.id" class="pb-2 text-text-200">
                        <div class="group relative">
                            <details class=" bg-white ring-1 ring-slate-900/5 shadow-md group-hover:bg-primary-100 group-hover:ring-primary-100 group-hover:text-white rounded-lg p-4">
                                <summary class="list-none flex flex-wrap items-center">
                                    <p>{{ line.id }}</p>
                                </summary>
                                <div class="pt-4">
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Type:</p>
                                        <div class="flex">
                                            <div v-for="type in line.type" :key="type">
                                                <div v-if="type === 'pt'">
                                                    <p class="text-sm font-medium">Bus</p>
                                                </div>
                                                <div v-else>
                                                    <p class="text-sm font-medium capitalize">{{ type }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Stops:</p>
                                        <p class="text-sm font-medium">{{ line.stops }}</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Departures:</p>
                                        <p class="text-sm font-medium">{{ line.departures }}</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Routes:</p>
                                        <p class="text-sm font-medium">{{ line.routesSize }}</p>
                                    </div>
                                    <div class="flex items-center justify-between">
                                        <p class="text-text-100 text-sm group-hover:text-white">Number Of Vehicles:</p>
                                        <p class="text-sm font-medium">{{ line.numberOfVehicles }}</p>
                                    </div>
                                </div>
                            </details>
                            <div class="actions pt-3 group-hover:text-white">
                                <i @click="$router.push({ name: 'Edit Line', params: { id: line._id } })" class="fa-solid fa-pen-to-square pr-5"></i>
                                <i @click="handleDelete(line.id)" class="fa-solid fa-trash-can"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="h-full">
                    <div class="h-full animate-pulse flex justify-center items-center">
                        <p>Loading lines...</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-1/4 h-full pl-2 pr-1">
            <h1 class="pb-4 text-text-200 text-2xl font-medium lg:col-span-2 flex">Filters</h1>
            <p class="flex pb-2 text-sm text-text-100">Types</p>
            <div class="flex items-center justify-between">
                <label for="bus">Bus</label>
                <input type="checkbox" name="bus" value="bus" v-model="bus" class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.4rem] checked:after:mt-[0.07rem] checked:after:block">
            </div>
            <div class="flex items-center justify-between">
                <label for="tram">Tram</label>
                <input type="checkbox" name="tram" value="tram" v-model="tram" class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.4rem] checked:after:mt-[0.07rem] checked:after:block">
            </div>
            <div class="flex items-center justify-between">
                <label for="train">Train</label>
                <input type="checkbox" name="train" value="train" v-model="train" class="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.4rem] checked:after:mt-[0.07rem] checked:after:block">
            </div>
        </div>
    </div>
    
</template>

<script>
import getScenario from '../../composables/getScenario'
import patchScenario from '../../composables/patchScenario'
import deleteLine from '../../composables/deleteLine'
import Heading from '../../components/Heading'
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
    components: { Heading },
    props: ['id'],
    setup(props) {
        const { scenario, lines, error, load } = getScenario(props.id)
        const { res: patchRes, error: patchError, patch } = patchScenario()
        const { res: deleteRes, error: deleteError, remove } = deleteLine()

        const bus = ref(true)
        const tram = ref(true)
        const train = ref(true)
        const filteredLines = ref(null)

        const editable = ref(false)
        const descriptionError = ref(null)
        const router = useRouter()
        const newDescription = ref('')
        const processing = ref(false)

        watchEffect(() => {
            console.log(bus.value)
            console.log(tram.value)
            console.log(train.value)
            if (lines._rawValue) {
                // array to store enabled filters
                let types = []

                if (bus.value) {
                    types.push('pt')
                }
                else {
                    types.filter((value, index, arr) => {
                        // If the value at the current array index matches the specified value (2)
                        if (value === 'pt') {
                            // Removes the value from the original array
                            arr.splice(index, 1);
                            return true;
                        }
                        return false;
                    })
                }

                if (tram.value) {
                    types.push('tram')
                }
                else {
                    types.filter((value, index, arr) => {
                        // If the value at the current array index matches the specified value (2)
                        if (value === 'tram') {
                            // Removes the value from the original array
                            arr.splice(index, 1);
                            return true;
                        }
                        return false;
                    })
                }
                if (train.value) {
                    types.push('train')
                }
                else {
                    types.filter((value, index, arr) => {
                        // If the value at the current array index matches the specified value (2)
                        if (value === 'train') {
                            // Removes the value from the original array
                            arr.splice(index, 1);
                            return true;
                        }
                        return false;
                    })
                }
                
                // apply filters
                filteredLines.value = lines._rawValue.filter(line => types.some(i => line.type.includes(i)))
                }
        })

        const handleSave = async() => {
            // clear previous errors (from canceling an edit with error)
            patchError.value = null

            processing.value = true

            await patch(newDescription.value, scenario.value)

            processing.value = false

            if (!patchError.value) {
                editable.value = false
                router.go()
            } else {
                // description error
                if (patchError.value.errors.description) {
                    descriptionError.value.innerHTML = patchError.value.errors.description
                    descriptionError.value.classList.remove('invisible')
                } else {
                    descriptionError.value.classList.add('invisible')
                }
            }
        }

        const handleDelete = async (lineId) => {
            await remove(scenario.value._id, lineId)

            if (!deleteError.value) {
                lines.value = null
                load()
            } else {
                // generic error
                console.log(deleteError.value)
            }

        }

        load()

        return { scenario, lines, error, filteredLines, bus, tram, train, editable, processing, descriptionError, handleSave, handleDelete, newDescription}
    }
}
</script>

<style>

</style>