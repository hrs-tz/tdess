<template>
    <div class="bg-white border border-grayBG flex items-center justify-between px-10 h-16">
        <p class="text-text-300 text-xl font-medium">{{ $route.name }}</p>
        <div v-if="$route.name === 'Scenarios'">
            <div class="relative rounded-md shadow-sm">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-100">
                    <i class="fa-solid fa-magnifying-glass fa-sm"></i>
                </div>
                <input type="text" name="searchKey" id="searchKey" v-model="search" @keyup="$emit('search', search)" class="search" placeholder="Search"/>
            </div>
        </div>
        <div v-if="$route.name === 'Scenario Details'">
            <div v-if="editEnabled">
                <div class="flex">
                    <button @click="$emit('cancel')" type="button" class="secondary-button mr-2">
                        <i class="fa-solid fa-xmark mr-2"></i>
                        Cancel
                    </button>
                    <div v-if="processing">
                        <button disabled type="button" class="disabled-button bg-opacity-100 border-opacity-100">
                            <Spinner/>
                            Saving...
                        </button> 
                    </div>
                    <div v-else>
                        <button @click="$emit('save')" type="button" class="button">
                            <i class="fa-solid fa-check mr-2"></i>
                            Save
                        </button>    
                    </div>
                </div>
            </div>
            <div v-else>
                <button @click="$emit('edit')" type="button" class="button">
                    <i class="fa-solid fa-pen fa-sm mr-2"></i>
                    Edit
                </button>
            </div>
        </div>
        <div v-if="$route.name === 'Add New Scenario' || $route.name === 'Add New Line'">
            <div v-if="processing">
                <div class="flex">
                    <button @click="$emit('cancel')" type="button" class="disabled-button mr-2">
                        <i class="fa-solid fa-xmark mr-2"></i>
                        Cancel
                    </button> 
                    <button disabled type="button" class="disabled-button bg-opacity-100 border-opacity-100">
                        <Spinner/>
                        Creating...
                    </button> 
                </div>
            </div>
            <div v-else>
                <div class="flex">
                    <button @click="$emit('cancel')" type="button" class="secondary-button mr-2">
                        <i class="fa-solid fa-xmark mr-2"></i>
                        Cancel
                    </button> 
                    <button @click="$emit('save')" type="button" class="button">
                        <i class="fa-solid fa-check mr-2"></i>
                        Create
                    </button> 
                </div>  
            </div>
        </div>
    </div>
</template>

<script>
import { ref, emit } from 'vue'
import Spinner from '../components/Spinner'

export default {
    name: 'Heading',
    components: { Spinner },
    props: ['editEnabled', 'processing'],
    setup () {
        const search = ref('')

        return { search }
    }
}
</script>

<style>

</style>