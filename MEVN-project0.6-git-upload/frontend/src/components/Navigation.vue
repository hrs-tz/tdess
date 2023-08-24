<template>
    <!-- <div class="sticky top-0 w-full"> -->
        <header class="bg-primary-200">
            <div class="px-10 py-3">
                <div class="flex items-center">
                    <p class="text-lg text-white font-medium pr-10 mr-4 border-r border-opacity-25 border-white">tdess</p>
                    <nav class="flex flex-col sm:flex-row items-center text-white">
                        <div class="flex gap-4 flex-1 justify-center font-medium underline-offset-4">
                            <router-link :to="{ name: 'Home' }" class="hover:bg-primary-100 duration-150 p-2 rounded-lg">Home</router-link>
                            <router-link :to="{ name: 'Dashboard' }" class="hover:bg-primary-100 p-2 duration-150 rounded-lg">Dashboard</router-link>
                            <router-link :to="{ name: 'Scenarios' }" class="hover:bg-primary-100 p-2 duration-150 rounded-lg">Scenarios</router-link>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
        <!-- <div class="bg-white border border-grayBG flex items-center justify-between px-10 h-16">
            <p class="text-text-300 text-xl font-medium">{{ $route.name }}</p>
            <div v-if="$route.name === 'Scenarios'">
                <div class="relative rounded-md shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-100">
                        <i class="fa-solid fa-magnifying-glass fa-sm"></i>
                    </div>
                    <input type="text" name="searchKey" id="searchKey" class="block w-full rounded-lg border-0 py-1.5 pl-9 pr-36 text-text-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-200 focus:outline-none sm:text-sm sm:leading-6" placeholder="Search"/>
                </div>
            </div>
        </div> -->
    <!-- </div> -->
</template>

<script>
import { ref } from 'vue'
export default {
    name: 'Navigation',
    setup() {
    }
}
</script>

<style>
    nav a.router-link-exact-active {
        background: #3633C2;
    }
</style>