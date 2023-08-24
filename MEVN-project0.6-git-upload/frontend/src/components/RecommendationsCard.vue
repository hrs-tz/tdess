<template>
    <div class="recommendations-card p-4">
        <h4 class="text-lg text-text-200 font-medium mb-4">{{ title }}</h4>
        <!-- body of card -->
        <div>
            <!-- score -->
            <div class="flex justify-between items-center">
                <p class="text-left text-sm text-text-100 pb-2">Score: </p>
                <p class="text-left text-sm text-text-200 pb-2">score</p>
            </div>
            <!-- average travel time -->
            <div class="flex justify-between items-center">
                <p class="text-left text-sm text-text-100 pb-2">Average Travel Time: </p>
                <p class="text-left text-sm text-text-200 pb-2">average travel time</p>
            </div>
            <!-- average transits -->
            <div class="flex justify-between items-center">
                <p class="text-left text-sm text-text-100 pb-2">Average Transits: </p>
                <p class="text-left text-sm text-text-200 pb-2">average transits</p>
            </div>
            <!-- total number of vehicles -->
            <div class="flex justify-between items-center">
                <p class="text-left text-sm text-text-100">Total Number of Vehicles: </p>
                <p class="text-left text-sm text-text-200">total number of vehicles</p>
            </div>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    props: ['title'],
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