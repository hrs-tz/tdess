<template>
    <div>
        <Heading @save="handleSave" @cancel="handleCancel" :processing="processing"/>
    </div>
    <div class="main-body">
        <div class="w-1/4 h-full pr-2 pl-1">
            <div class="h-full flex flex-col">
                <div class="grid grid-cols-1 lg:grid-cols-2">
                    <input type="text" placeholder="Scenario Id" required v-model="scenarioId" class="text-text-200 text-2xl font-medium lg:col-span-2 flex outline-none border-b border-solid">
                    <p ref="idError" class="invisible text-red-700 lg:col-span-2 flex text-xs font-medium">error</p>
                </div>
                <div class="border border-gray-200 rounded-lg p-2 text-text-100 h-full mt-4">
                    <div class="flex flex-col h-full">
                        <p class="text-sm text-text-200">Description</p>
                        <textarea v-model="description" placeholder="Write a description for the scenario..." name="description" id="description" cols="30" rows="10" class="resize-none w-full h-full outline-none"></textarea>
                        <p ref="descriptionError" class="invisible text-red-700 lg:col-span-2 flex text-xs font-medium">error</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-1/2 h-full px-4 overflow-y-auto opacity-50">
            <div class="h-96">
                <h1 class="pb-4 text-text-200 text-2xl font-medium lg:col-span-2 flex">Lines</h1>
            </div>
        </div>
        <div class="w-1/4 h-full pl-2 pr-1 opacity-50">
            <h1 class="pb-4 text-text-200 text-2xl font-medium lg:col-span-2 flex">Filters</h1>
            <p class="flex pb-2 text-sm text-text-100">Types</p>
            <div class="flex items-center justify-between">
                <label for="bus">Bus</label>
                <input type="checkbox" name="bus" value="bus" disabled class="before:content[''] peer relative h-5 w-5 cursor-default appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.4rem] checked:after:mt-[0.07rem] checked:after:block">
            </div>
            <div class="flex items-center justify-between">
                <label for="tram">Tram</label>
                <input type="checkbox" name="tram" value="tram" disabled class="before:content[''] peer relative h-5 w-5 cursor-default appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.4rem] checked:after:mt-[0.07rem] checked:after:block">
            </div>
            <div class="flex items-center justify-between">
                <label for="train">Train</label>
                <input type="checkbox" name="train" value="train" disabled class="before:content[''] peer relative h-5 w-5 cursor-default appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.4rem] checked:after:mt-[0.07rem] checked:after:block">
            </div>
        </div>
    </div>
    
</template>

<script>
import postScenario from '../../composables/postScenario'
import Heading from '../../components/Heading'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
    components: { Heading },
    setup() {
        const { res, error, post } = postScenario()
        const scenarioId = ref('')
        const description = ref('')

        const router = useRouter()
        const route = useRoute()

        const idError = ref(null)
        const descriptionError = ref(null)

        const processing = ref(false)

        const handleSave = async() => {
            // clear previous errors
            error.value = null
            // hide error tags
            idError.value.classList.add('invisible')
            descriptionError.value.classList.add('invisible')
            
            processing.value = true
            await post(scenarioId.value, description.value)
            processing.value = false
            if (!error.value) {
                router.push({ name: 'Scenario Details', params: { id: scenarioId.value } })
            } else {
                // id error
                if (error.value.errors._id) {
                    idError.value.innerHTML = error.value.errors._id
                    idError.value.classList.remove('invisible')
                } else {
                    idError.value.classList.add('invisible')
                }
                // description error
                if (error.value.errors.description) {
                    descriptionError.value.innerHTML = error.value.errors.description
                    descriptionError.value.classList.remove('invisible')
                } else {
                    descriptionError.value.classList.add('invisible')
                }
            }
        }

        const handleCancel = () => {
            router.push({ name: 'Scenarios' })
        }

        return { res, error, post, scenarioId, description, idError, descriptionError, processing, handleSave, handleCancel }
    }
}
</script>

<style>

</style>