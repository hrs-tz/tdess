<template>
    <div class="card group duration-150">
        <div v-if="isIcon">
            <h4 class="text-lg text-text-200 font-medium pt-2 pb-3 group-hover:text-white">{{ title }}</h4>
            <div class="pt-7 pb-6">
                <i class="fa-solid fa-plus text-text-200 group-hover:text-white"></i>
            </div>
        </div>
        <div v-else>
            <router-link :to="{ name: 'Scenario Details', params: { id: title } }">
                <h4 class="text-lg text-text-200 font-medium pt-2 pb-3 group-hover:text-white">{{ title }}</h4>
                <div v-if="body" class="pt-7 pb-1">
                    <p class="truncate text-left text-sm text-text-200 opacity-75 px-8 pb-1 group-hover:text-white group-hover:opacity-100">{{ body }}</p>
                </div>
                <div v-else>
                    <p class="text-sm text-text-200 opacity-75 flex pt-7 pb-7 px-8 group-hover:text-white group-hover:opacity-100">No description</p>
                </div>
                <div v-if="badge" class="badge">
                    <span>{{ badge }}</span>
                </div>
            </router-link>
        </div>
        <div v-if="actions" class="actions text-text-200 group-hover:text-white">
            <i @click="$emit('delete')" class="fa-solid fa-trash-can"></i>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    props: ['title', 'body', 'badge', 'actions'],
    setup (props) {

        const isIcon = ref(false)

        if (props.body) {
            if (props.body.includes('<i')) {
                isIcon.value = true
            }
        }
        
        return { isIcon }
    }
}
</script>

<style>

</style>