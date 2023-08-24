<template>
    <div id='map' class="h-full z-10 rounded-lg"></div>
    <!-- visualization interactions -->
    <div class="bg-white bg-opacity-50 flex w-full items-center absolute top-0 z-10 px-4 py-2">
        <div class="flex w-full items-center">
        <!-- restart button -->
        <button @click="handleRestart" class="mr-2">
            <i class="fa-solid fa-arrow-rotate-left fa-small"></i>
        </button>
        <!-- play / pause button -->
        <div v-if="isAnimating">
            <button @click="toggleAnimation">
            <i class="fa-solid fa-pause"></i>
            </button>
        </div>
        <div v-else>
            <button @click="toggleAnimation">
            <i class="fa-solid fa-play"></i>
            </button>
        </div>
        <!-- speed button -->
        <button @click="handleAnimationSpeed" class="flex m-2">
            <div v-if="animationSpeed === 1" class="flex">
            <i class="fa-solid fa-play fa-2xs"></i>
            <i class="fa-solid fa-play fa-2xs opacity-50"></i>
            <i class="fa-solid fa-play fa-2xs opacity-50"></i>
            </div>
            <div v-if="animationSpeed === 2" class="flex">
            <i class="fa-solid fa-play fa-2xs"></i>
            <i class="fa-solid fa-play fa-2xs"></i>
            <i class="fa-solid fa-play fa-2xs opacity-50"></i>
            </div>
            <div v-if="animationSpeed === 3" class="flex">
            <i class="fa-solid fa-play fa-2xs"></i>
            <i class="fa-solid fa-play fa-2xs"></i>
            <i class="fa-solid fa-play fa-2xs"></i>
            </div>
        </button>
        <!-- time slider -->
        <input id="time-range" type="range" min="0" max="86399" v-model="currentTimestamp" class="m-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
        <!-- current timestamp -->
        <p class="ml-2 select-none cursor-default">{{ reversedTimeConverter(currentTimestamp) }}</p>
        </div>
    </div>
</template>

<script>
import Mapbox from "mapbox-gl"
import anime from 'animejs'
import { onMounted, ref, watch, watchEffect } from "vue"
import getDepartures from '../composables/getDepartures'

export default {
    props: ['selectedScenario'],
    setup (props) {
        const { departures: d, error: loadDeparturesError, load: loadDepartures } = getDepartures()

        // global constants

        const startTimestamp = 17800
        const endTimestamp = 86399

        // variables

        let map
        let markers = []
        // variable for starting / stopping simulation
        let simulation
        let step = 60

        // refs

        const selectedScenario = ref(props.selectedScenario)
        const currentTimestamp = ref(startTimestamp) // initialize the simulated timestamp
        const isAnimating = ref(false)
        const animationSpeed = ref(1)
        const animationState = ref({}) // variable to track animation state for each vehicle
        const vehicleMarkerElement = ref(null)
        // departures be like:
        const departures = ref(
        [ 
            {
                departureId: "1_16620.0",
                lineId: "1",
                routeId: "1",
                id: "1_0",
                events: [
                {
                    location: [ 14.335640601068604, 51.78309460006095 ],
                    timestamp: 16620,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.335640601068604, 51.78309460006095 ],
                    timestamp: 16740,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.335568499999988, 51.78373879999998 ],
                    [ 14.335712699999991, 51.78245039999999 ]
                    ],
                    timestamp: 16741,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.335712699999991, 51.78245039999999 ],
                    [ 14.33555729999999, 51.78134869999999 ]
                    ],
                    timestamp: 16741,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.335712699999991, 51.78245039999999 ],
                    [ 14.33555729999999, 51.78134869999999 ]
                    ],
                    timestamp: 16751,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33555729999999, 51.78134869999999 ],
                    [ 14.33542309999999, 51.77927909999999 ]
                    ],
                    timestamp: 16751,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.33555729999999, 51.78134869999999 ],
                    [ 14.33542309999999, 51.77927909999999 ]
                    ],
                    timestamp: 16770,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33542309999999, 51.77927909999999 ],
                    [ 14.335354399999991, 51.77817629999998 ]
                    ],
                    timestamp: 16770,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.33542309999999, 51.77927909999999 ],
                    [ 14.335354399999991, 51.77817629999998 ]
                    ],
                    timestamp: 16780,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.335354399999991, 51.77817629999998 ],
                    [ 14.335342699999991, 51.777988499999985 ]
                    ],
                    timestamp: 16780,
                    type: 'entered link'
                },
                {
                    location: [ 14.335348549988737, 51.77808240000085 ],
                    timestamp: 16781,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.335348549988737, 51.77808240000085 ],
                    timestamp: 16880,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.335354399999991, 51.77817629999998 ],
                    [ 14.335342699999991, 51.777988499999985 ]
                    ],
                    timestamp: 16881,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.335342699999991, 51.777988499999985 ],
                    [ 14.33529399999999, 51.777206699999994 ]
                    ],
                    timestamp: 16881,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.335342699999991, 51.777988499999985 ],
                    [ 14.33529399999999, 51.777206699999994 ]
                    ],
                    timestamp: 16888,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33529399999999, 51.777206699999994 ],
                    [ 14.335269999999989, 51.7757073 ]
                    ],
                    timestamp: 16888,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.33529399999999, 51.777206699999994 ],
                    [ 14.335269999999989, 51.7757073 ]
                    ],
                    timestamp: 16902,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.335269999999989, 51.7757073 ],
                    [ 14.33522329999999, 51.775228599999984 ]
                    ],
                    timestamp: 16902,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.335269999999989, 51.7757073 ],
                    [ 14.33522329999999, 51.775228599999984 ]
                    ],
                    timestamp: 16907,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33522329999999, 51.775228599999984 ],
                    [ 14.335135499999991, 51.77427189999998 ]
                    ],
                    timestamp: 16907,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.33522329999999, 51.775228599999984 ],
                    [ 14.335135499999991, 51.77427189999998 ]
                    ],
                    timestamp: 16916,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.335135499999991, 51.77427189999998 ],
                    [ 14.335019699999993, 51.771788 ]
                    ],
                    timestamp: 16916,
                    type: 'entered link'
                },
                {
                    location: [ 14.335077598566343, 51.77302995013971 ],
                    timestamp: 16938,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.335077598566343, 51.77302995013971 ],
                    timestamp: 16940,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.335135499999991, 51.77427189999998 ],
                    [ 14.335019699999993, 51.771788 ]
                    ],
                    timestamp: 16941,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.335019699999993, 51.771788 ],
                    [ 14.33496459999999, 51.770496499999986 ]
                    ],
                    timestamp: 16941,
                    type: 'entered link'
                },
                {
                    location: [ 14.334992149648913, 51.771142250037265 ],
                    timestamp: 16951,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.334992149648913, 51.771142250037265 ],
                    timestamp: 17060,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.335019699999993, 51.771788 ],
                    [ 14.33496459999999, 51.770496499999986 ]
                    ],
                    timestamp: 17061,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33496459999999, 51.770496499999986 ],
                    [ 14.33495099999999, 51.770257799999996 ]
                    ],
                    timestamp: 17061,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.33496459999999, 51.770496499999986 ],
                    [ 14.33495099999999, 51.770257799999996 ]
                    ],
                    timestamp: 17064,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33495099999999, 51.770257799999996 ],
                    [ 14.334840899999989, 51.76798529999999 ]
                    ],
                    timestamp: 17064,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.33495099999999, 51.770257799999996 ],
                    [ 14.334840899999989, 51.76798529999999 ]
                    ],
                    timestamp: 17085,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.334840899999989, 51.76798529999999 ],
                    [ 14.333961799999992, 51.766736399999985 ]
                    ],
                    timestamp: 17085,
                    type: 'entered link'
                },
                {
                    location: [ 14.334401343966693, 51.76736085083351 ],
                    timestamp: 17097,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.334401343966693, 51.76736085083351 ],
                    timestamp: 17120,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.334840899999989, 51.76798529999999 ],
                    [ 14.333961799999992, 51.766736399999985 ]
                    ],
                    timestamp: 17121,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.333961799999992, 51.766736399999985 ],
                    [ 14.333617599999991, 51.76621680000001 ]
                    ],
                    timestamp: 17121,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.333961799999992, 51.766736399999985 ],
                    [ 14.333617599999991, 51.76621680000001 ]
                    ],
                    timestamp: 17126,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.333617599999991, 51.76621680000001 ],
                    [ 14.333557299999994, 51.76616169999999 ]
                    ],
                    timestamp: 17126,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.333617599999991, 51.76621680000001 ],
                    [ 14.333557299999994, 51.76616169999999 ]
                    ],
                    timestamp: 17127,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.333557299999994, 51.76616169999999 ],
                    [ 14.332910599999991, 51.76522299999999 ]
                    ],
                    timestamp: 17127,
                    type: 'entered link'
                },
                {
                    location: [ 14.333233946664844, 51.76569235045158 ],
                    timestamp: 17136,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.333233946664844, 51.76569235045158 ],
                    timestamp: 17180,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.333557299999994, 51.76616169999999 ],
                    [ 14.332910599999991, 51.76522299999999 ]
                    ],
                    timestamp: 17181,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.332910599999991, 51.76522299999999 ],
                    [ 14.332054299999989, 51.763908199999996 ]
                    ],
                    timestamp: 17181,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.332910599999991, 51.76522299999999 ],
                    [ 14.332054299999989, 51.763908199999996 ]
                    ],
                    timestamp: 17200,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.332054299999989, 51.763908199999996 ],
                    [ 14.331269699999993, 51.76285079999999 ]
                    ],
                    timestamp: 17200,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.332054299999989, 51.763908199999996 ],
                    [ 14.331269699999993, 51.76285079999999 ]
                    ],
                    timestamp: 17216,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.331269699999993, 51.76285079999999 ],
                    [ 14.33099999999999, 51.762 ]
                    ],
                    timestamp: 17216,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.331269699999993, 51.76285079999999 ],
                    [ 14.33099999999999, 51.762 ]
                    ],
                    timestamp: 17223,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33099999999999, 51.762 ],
                    [ 14.33099999999999, 51.760999999999996 ]
                    ],
                    timestamp: 17223,
                    type: 'entered link'
                },
                {
                    location: [ 14.331000000025396, 51.76150000002124 ],
                    timestamp: 17230,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.331000000025396, 51.76150000002124 ],
                    timestamp: 17340,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.33099999999999, 51.762 ],
                    [ 14.33099999999999, 51.760999999999996 ]
                    ],
                    timestamp: 17341,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.33099999999999, 51.760999999999996 ],
                    [ 14.327643599999993, 51.76130159999999 ]
                    ],
                    timestamp: 17341,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.33099999999999, 51.760999999999996 ],
                    [ 14.327643599999993, 51.76130159999999 ]
                    ],
                    timestamp: 17358,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.327643599999993, 51.76130159999999 ],
                    [ 14.327638999999989, 51.759511199999984 ]
                    ],
                    timestamp: 17358,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.327643599999993, 51.76130159999999 ],
                    [ 14.327638999999989, 51.759511199999984 ]
                    ],
                    timestamp: 17371,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.327638999999989, 51.759511199999984 ],
                    [ 14.327720699999992, 51.758875599999996 ]
                    ],
                    timestamp: 17371,
                    type: 'entered link'
                },
                {
                    location: [ 14.327679850297027, 51.7591934000167 ],
                    timestamp: 17375,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.327679850297027, 51.7591934000167 ],
                    timestamp: 17480,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.327638999999989, 51.759511199999984 ],
                    [ 14.327720699999992, 51.758875599999996 ]
                    ],
                    timestamp: 17481,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.327720699999992, 51.758875599999996 ],
                    [ 14.32782989999999, 51.75793939999999 ]
                    ],
                    timestamp: 17481,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.327720699999992, 51.758875599999996 ],
                    [ 14.32782989999999, 51.75793939999999 ]
                    ],
                    timestamp: 17488,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.32782989999999, 51.75793939999999 ],
                    [ 14.327951299999992, 51.75702789999998 ]
                    ],
                    timestamp: 17488,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.32782989999999, 51.75793939999999 ],
                    [ 14.327951299999992, 51.75702789999998 ]
                    ],
                    timestamp: 17495,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.327951299999992, 51.75702789999998 ],
                    [ 14.327994199999988, 51.75674939999998 ]
                    ],
                    timestamp: 17495,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.327951299999992, 51.75702789999998 ],
                    [ 14.327994199999988, 51.75674939999998 ]
                    ],
                    timestamp: 17497,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.327994199999988, 51.75674939999998 ],
                    [ 14.32812069999999, 51.75574779999999 ]
                    ],
                    timestamp: 17497,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.327994199999988, 51.75674939999998 ],
                    [ 14.32812069999999, 51.75574779999999 ]
                    ],
                    timestamp: 17504,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.32812069999999, 51.75574779999999 ],
                    [ 14.328183699999991, 51.75520139999998 ]
                    ],
                    timestamp: 17504,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.32812069999999, 51.75574779999999 ],
                    [ 14.328183699999991, 51.75520139999998 ]
                    ],
                    timestamp: 17508,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.328183699999991, 51.75520139999998 ],
                    [ 14.328285799999989, 51.75418299999999 ]
                    ],
                    timestamp: 17508,
                    type: 'entered link'
                },
                {
                    location: [ 14.3282347506005, 51.754692200035144 ],
                    timestamp: 17514,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.3282347506005, 51.754692200035144 ],
                    timestamp: 17600,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.328183699999991, 51.75520139999998 ],
                    [ 14.328285799999989, 51.75418299999999 ]
                    ],
                    timestamp: 17601,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.328285799999989, 51.75418299999999 ],
                    [ 14.328292699999993, 51.75409179999999 ]
                    ],
                    timestamp: 17601,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.328285799999989, 51.75418299999999 ],
                    [ 14.328292699999993, 51.75409179999999 ]
                    ],
                    timestamp: 17602,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.328292699999993, 51.75409179999999 ],
                    [ 14.32835049999999, 51.752214099999996 ]
                    ],
                    timestamp: 17602,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.328292699999993, 51.75409179999999 ],
                    [ 14.32835049999999, 51.752214099999996 ]
                    ],
                    timestamp: 17615,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.32835049999999, 51.752214099999996 ],
                    [ 14.328399399999993, 51.75101159999999 ]
                    ],
                    timestamp: 17615,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.32835049999999, 51.752214099999996 ],
                    [ 14.328399399999993, 51.75101159999999 ]
                    ],
                    timestamp: 17624,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.328399399999993, 51.75101159999999 ],
                    [ 14.328336299999991, 51.74923179999999 ]
                    ],
                    timestamp: 17624,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.328399399999993, 51.75101159999999 ],
                    [ 14.328336299999991, 51.74923179999999 ]
                    ],
                    timestamp: 17635,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.328336299999991, 51.74923179999999 ],
                    [ 14.324339599999991, 51.74958929999999 ]
                    ],
                    timestamp: 17635,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.328336299999991, 51.74923179999999 ],
                    [ 14.324339599999991, 51.74958929999999 ]
                    ],
                    timestamp: 17669,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.324339599999991, 51.74958929999999 ],
                    [ 14.32363579999999, 51.74947239999999 ]
                    ],
                    timestamp: 17669,
                    type: 'entered link'
                },
                {
                    location: [ 14.323987699541224, 51.74953085052544 ],
                    timestamp: 17675,
                    type: 'VehicleArrivesAtFacility'
                },
                {
                    location: [ 14.323987699541224, 51.74953085052544 ],
                    timestamp: 17675,
                    type: 'VehicleDepartsAtFacility'
                },
                {
                    location: [
                    [ 14.324339599999991, 51.74958929999999 ],
                    [ 14.32363579999999, 51.74947239999999 ]
                    ],
                    timestamp: 17676,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.32363579999999, 51.74947239999999 ],
                    [ 14.32166799999999, 51.74902989999998 ]
                    ],
                    timestamp: 17676,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.32363579999999, 51.74947239999999 ],
                    [ 14.32166799999999, 51.74902989999998 ]
                    ],
                    timestamp: 17694,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.32166799999999, 51.74902989999998 ],
                    [ 14.31964569999999, 51.748614799999984 ]
                    ],
                    timestamp: 17694,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.32166799999999, 51.74902989999998 ],
                    [ 14.31964569999999, 51.748614799999984 ]
                    ],
                    timestamp: 17712,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.31964569999999, 51.748614799999984 ],
                    [ 14.31799649999999, 51.748265499999995 ]
                    ],
                    timestamp: 17712,
                    type: 'entered link'
                },
                {
                    location: [
                    [ 14.31964569999999, 51.748614799999984 ],
                    [ 14.31799649999999, 51.748265499999995 ]
                    ],
                    timestamp: 17727,
                    type: 'left link'
                },
                {
                    location: [
                    [ 14.31799649999999, 51.748265499999995 ],
                    [ 14.316640399999992, 51.74799559999998 ]
                    ],
                    timestamp: 17727,
                    type: 'entered link'
                },
                {
                    location: [ 14.317318447962936, 51.74813055195002 ],
                    timestamp: 17738,
                    type: 'VehicleArrivesAtFacility'
                } 
                ]
            }
        ])
        
        // util functions

        const reversedTimeConverter = (timeInSeconds) => {

            const timeInHMS = new Date(timeInSeconds * 1000).toISOString().slice(11, 19);

            return timeInHMS
        }

        // interactions functions

        const toggleAnimation = () => {
            isAnimating.value = !isAnimating.value
            if (isAnimating.value) {
                startAnimation();
            } else {
                pauseAnimation();
            }
        }

        const handleAnimationSpeed = () => {
            if (animationSpeed.value === 3) {
                animationSpeed.value = 1
            } else {
                animationSpeed.value ++
            }
        }

        const handleRestart = () => {
            // stop clock
            clearInterval(simulation)

            // initialize timpestamp
            currentTimestamp.value = startTimestamp

            // clear vehicle symbols layer
            map.getSource('vehicles').setData({
                type: 'FeatureCollection',
                features: []
            })

            // stop animation
            isAnimating.value = false
        }

        const pauseAnimation = () => {
            clearInterval(simulation)
        }

        const startAnimation = () => {
            //startVisualization()
            // Animate the departure's events
            const events = departures.value.events;
            for (let i = 0; i < events.length - 1; i++) {
                const event = events[i]
                const nextEvent = events[i + 1]

                const duration = calculateAnimationDuration(event.timestamp, nextEvent.timestamp)

                anime({
                    targets: this.vehicleMarkerElement,
                    translateX: [event.location[0], nextEvent.location[0]],
                    translateY: [event.location[1], nextEvent.location[1]],
                    easing: 'linear',
                    duration
                })
            }
        }

        // visualization functions

        const initializeMap = () => {
            map = new Mapbox.Map({
                container: 'map', // container ID
                // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
                style: 'mapbox://styles/mapbox/streets-v12', // style URL
                center: [14.333540, 51.757856], // starting position [lng, lat]
                zoom: 9 // starting zoom
            })
            
            // Add your sources, layers, and markers here
            // Example:
            map.on('load', () => {

                // sources and layers
                map.addSource('vehicle-path-source', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                        type: 'LineString',
                        coordinates: []
                        }
                    }
                })

                map.addLayer({
                    id: 'vehicle-path-layer',
                    type: 'line',
                    source: 'vehicle-path-source',
                    paint: {
                        'line-color': 'blue',
                        'line-width': 2
                    }
                })

                // markers
                departures.value.forEach(departure => { 
                    const markerElement = document.createElement('div')
                    markerElement.className = 'vehicle-marker-' + departure.id
                    markerElement.style.width = '20px'
                    markerElement.style.height = '20px'
                    markerElement.style.backgroundColor = 'red'

                    const marker = new Mapbox.Marker({
                        element: markerElement,
                        offset: [0, 0]
                    }).setLngLat([departure.events[0].location[0], departure.events[0].location[1]]).addTo(map)

                    markers.push(marker)

                    // add the coordinates for the path to the source
                    const pathCoordinates = departure.events
                        .filter(event => event.type === 'left link' || event.type === 'entered link')
                        .map(event => event.location)

                    // update the source with the path coordinates
                    map.getSource('vehicle-path-source').setData({
                        type: 'Feature',
                        geometry: {
                        type: 'LineString',
                        coordinates: pathCoordinates,
                        }
                    })

                    startAnimationForVehicle(marker, departure);
                })
                // // Start animation for each vehicle (departure)
                // markers.forEach((marker, index) => {
                //     startAnimationForVehicle(marker, departureData[index])
                // })
            })
        }

        const startAnimationForVehicle = (marker, departure) => {
            // animation duration in milliseconds
            const animationDuration = 100000
            const pathCoordinates = departure.events
                .filter(event => event.type === 'left link' || event.type === 'entered link')
                .map(event => event.location)

            anime({
                targets: marker._element,
                translateX: pathCoordinates.map(coord => coord[0]),
                translateY: pathCoordinates.map(coord => coord[1]),
                duration: animationDuration,
                easing: 'linear', // Adjust easing if needed
                loop: false
            })
        }

        const animateSimulation = () => {
            if (!simulationStarted) {
                return
            }

            // Iterate through departure events and check if their timestamp matches currentTimestamp
            departures.forEach(departure => {
                const event = departure.events.find(event => event.timestamp === currentTimestamp)
                if (event) {
                // Trigger animation for the event (enter link, leave link, etc.)
                // Update vehicle marker positions based on event.location
                }
            })

            // Use requestAnimationFrame to continue the animation loop
            requestAnimationFrame(animateSimulation)
        }

        const startVisualization = () => {
            // start simulation clock
            simulation = setInterval(() => {
                console.log(currentTimestamp.value)
                // increment the simulated timestamp by the clock step
                currentTimestamp.value = currentTimestamp.value + step
                updateVehicleMarkers(currentTimestamp)
            }, 1000) // Update every 1 second
        }

        // watch functions

        watch(selectedScenario, async () => {
            await loadDepartures(selectedScenario.value)
            console.log(departures.value[0])
        })

        watch(currentTimestamp, () => {
            if (currentTimestamp.value >= endTimestamp) {
                pauseAnimation()
                isAnimating.value = false
            }
            if (typeof currentTimestamp.value !== 'number') {
                currentTimestamp.value = +currentTimestamp.value
                console.log(currentTimestamp.value)
            }
        })

        watch(animationSpeed, () => {
            // clock step = 60 * speed of animation chosen by the user (1 rts = (animationSpeed) simulated minute(s))
            step = animationSpeed.value * 60
        })

        // life cycle

        onMounted(async () => {
            Mapbox.accessToken = process.env.VUE_APP_MAPBOX_API_KEY
            // initialize map
            initializeMap()
        })

        return { currentTimestamp, isAnimating, animationSpeed, currentTimestamp, isAnimating, animationSpeed, toggleAnimation, handleAnimationSpeed, handleRestart, reversedTimeConverter }
    }
}
</script>