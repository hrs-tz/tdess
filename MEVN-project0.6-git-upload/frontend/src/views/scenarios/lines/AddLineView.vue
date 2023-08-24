<template>
    <div>
        <Heading @save="handleSave" @cancel="handleCancel"/>
    </div>
    <div class="main-body">
        <div class="w-1/3 lg:w-2/3 h-full pr-4 pl-1">
            <div id='map' class="h-full z-10 rounded-lg"></div>
        </div>
        <div class="w-2/3 lg:w-1/3 h-full overflow-y-auto text-center bg-white ring-1 ring-slate-900/5 rounded-lg shadow-md">
            <div class="text-text-100 p-6">
                <!-- add new stop facility minimized -->
                <div v-if="!addingStopFacility">
                    <div class="flex items-center justify-center">
                        <h2 class="text-lg font-medium text-left flex-1">Add Stop Facility</h2>
                        <div>
                            <i @click="addingStopFacility = false" class="invisible fa-solid fa-xmark text-text-200 mr-2"></i>
                            <i @click="addingStopFacility = true" class="fa-solid fa-plus text-text-200 hover:text-primary-200 active:text-primary-300"></i>
                        </div>
                    </div>
                </div>
                <!-- add new stop facility collapsed -->
                <div v-else>
                    <div class="flex items-center justify-start">
                        <h2 class="text-lg font-medium text-left flex-1">Add Stop Facility</h2>
                        <div>
                            <i @click="handleCancelSF" class="fa-solid fa-xmark text-text-200 mr-2 hover:text-primary-200 active:text-primary-300"></i>
                            <i @click="handleCheckSF" class="fa-solid fa-check text-text-200 hover:text-primary-200 active:text-primary-300"></i>
                        </div>
                    </div>
                    <div class="pt-4">
                        <!-- stop facility id input -->
                        <div class="mb-2">
                            <div class="flex items-center justify-between">
                                <label for="stopFacilityId" class="text-sm">Id:</label>
                                <input id="stopFacilityId" type="text" placeholder="Stop Facility Id" required v-model="stopFacilityId" class="text-input"> 
                            </div>
                            <p ref="stopFacilityIdError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                        </div> 
                        <!-- stop facility coords section -->
                        <div>
                            <div class="mb-2">
                                <!-- add coords button -->
                                <div class="flex items-center justify-between">
                                    <p class="text-sm">Coordinates:</p>
                                    <i @click="handleAddFacility" ref="addCoordsButton" class="fa-solid fa-map-pin text-text-200 hover:text-primary-200 active:text-primary-300"></i>
                                </div>
                                <p class="invisible text-red-700 flex text-xs font-medium justify-end">dummy error for symmetry</p>
                            </div>
                            <!-- longitude input -->
                            <div class="pl-4">
                                <div class="flex items-center justify-between">
                                    <label for="longitude" class="text-sm">Longitude:</label>
                                    <input @keypress="isNumber" id="longitude" type="number" placeholder="0,00" required v-model="longitude" class="text-input">
                                </div> 
                                <p ref="longitudeError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                            <!-- latitude input -->
                            <div class="pl-4 mb-2">
                                <div class="flex items-center justify-between">
                                    <label for="latitude" class="text-sm">Latitude:</label>
                                    <input @keypress="isNumber" id="latitude" type="number" placeholder="0,00" required v-model="latitude" class="text-input">
                                </div>
                                <p ref="latitudeError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                        <!-- reference link section -->
                        <div>
                            <!-- reference link button -->
                            <div class="mb-2">
                                <div class="flex items-center justify-between">
                                    <p class="text-sm">Reference Link:</p>
                                    <i @click="handleAddReferenceLink" ref="addReferenceLinkButton" class="fa-solid fa-map-pin text-text-200 hover:text-primary-200 active:text-primary-300"></i>
                                </div>
                                <p class="invisible text-red-700 flex text-xs font-medium justify-end">dummy error for symmetry</p>
                            </div>
                            <!-- reference link drop down list -->
                            <div class="pl-4 mb-2">
                                <div class="flex items-center justify-between">
                                    <label for="referenceLink" class="text-sm">Id:</label>
                                    <div>
                                        <select name="referenceLink" id="referenceLink" v-model="referenceLink" class="dropdown-list">
                                            <option disabled value="">Please select one</option>
                                            <option v-for="link in links" :key="link._id" :value="link._id">{{ link._id }}</option>
                                        </select>
                                    </div>
                                </div>
                                <p ref="linkRefError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                        <!-- blocks traffic toggle -->
                        <div class="flex items-center justify-between">
                            <label for="isBlocking" class="text-sm">Blocks Traffic:</label>
                            <input type="checkbox" name="isBlocking" value="isBlocking" v-model="isBlocking" class="before:content[''] peer relative h-4 w-4 cursor-default appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.6125rem] checked:after:w-[0.275rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.32rem] checked:after:mt-[0.07rem] checked:after:block">
                        </div>
                    </div>
                </div>
                <!-- add new vehicle type minimized -->
                <div v-if="!addingVehicleType">
                    <div class="flex items-center justify-center mt-6">
                        <h2 class="text-lg font-medium text-left flex-1">Add Vehicle Type</h2>
                        <div>
                            <i @click="addingVehicleType = false" class="invisible fa-solid fa-xmark text-text-200 mr-2"></i>
                            <i @click="addingVehicleType = true" class="fa-solid fa-plus text-text-200 hover:text-primary-200 active:text-primary-300"></i>
                        </div>
                    </div>
                </div>
                <!-- add new vehicle type collapsed -->
                <div v-else>
                    <div class="flex items-center justify-center mt-6">
                        <h2 class="text-lg font-medium text-left flex-1">Add Vehicle Type</h2>
                        <div>
                            <i @click="handleCancelVT" class="fa-solid fa-xmark text-text-200 mr-2 hover:text-primary-200 active:text-primary-300"></i>
                            <i @click="handleCheckVT" class="fa-solid fa-check text-text-200 hover:text-primary-200 active:text-primary-300"></i>
                        </div>
                    </div>
                    <div class="pt-4">
                        <!-- vehicle type id input -->
                        <div class="flex items-center justify-between mb-2">
                            <label for="vehicleTypeId" class="text-sm">Id:</label>
                            <div>
                                <input id="vehicleTypeId" type="text" placeholder="Vehicle Type Id" required v-model="vehicleTypeId" class="text-input">
                                <p ref="vehicleTypeIdError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                        <!-- seats input -->
                        <div class="flex items-center justify-between mb-2">
                            <label for="seats" class="text-sm">Seats:</label>
                            <div>
                                <input @keypress="isInteger" id="seats" type="number" placeholder="Number of seats" required v-model="seats" class="text-input">
                                <p ref="seatsError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                        <!-- standing capacity input -->
                        <div class="flex items-center justify-between mb-2">
                            <label for="standingCapacity" class="text-sm">Standing Cap:</label>
                            <div>
                                <input @keypress="isInteger" id="standingCapacity" type="number" placeholder="Number of standing passengers" required v-model="standingCapacity" class="text-input">
                                <p ref="standingCapacityError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                        <!-- length input -->
                        <div class="flex items-center justify-between mb-2">
                            <label for="length" class="text-sm">Length:</label>
                            <div>
                                <input @keypress="isNumber" id="length" type="number" placeholder="Vehicle length" required v-model="length" class="text-input">
                                <p ref="lengthError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                        <!-- width input -->
                        <div class="flex items-center justify-between mb-2">
                            <label for="width" class="text-sm">Width:</label>
                            <div>
                                <input @keypress="isNumber" id="width" type="number" placeholder="Vehicle width" required v-model="width" class="text-input">
                                <p ref="widthError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- add new line -->
                <div class="flex items-center mt-6">
                    <h2 class="text-lg font-medium">Add Line</h2>
                </div>
                <form class="pt-4">
                    <!-- line id input -->
                    <div class="mb-2">
                        <div class="flex items-center justify-between">
                            <label for="lineId" class="text-sm">Line:</label>
                            <input id="lineId" type="text" placeholder="Line id" required v-model="lineId" class="text-input w-[12.3rem]">
                        </div>
                        <p ref="lineIdError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                    </div>
                    <!-- route section -->
                    <div>
                        <!-- route drop down list -->
                        <div class="mb-2">
                            <div class="flex items-center justify-between">
                                <label for="route" class="text-sm">Route:</label>
                                <div class="flex items-center">
                                    <select name="route" id="route" v-model="selectedRoute" class="dropdown-list">
                                        <option value="">New route</option>
                                        <option v-for="route in routes" :key="route._id" :value="route._id">{{ route._id }}</option>
                                    </select>
                                    <div v-if="selectedRoute">
                                        <i @click="handleRemoveRoute" class="fa-solid fa-circle-minus text-text-200 ml-4"></i>
                                    </div>
                                    <div v-else>
                                        <i @click="handleAddRoute" class="fa-solid fa-circle-plus text-text-200 ml-4"></i>
                                    </div>
                                </div>
                            </div>
                            <p ref="routeError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                        </div>
                        <!-- route id input -->
                        <div class="pl-4">
                            <div class="flex items-center justify-between">
                                <label for="routeId" class="text-sm">Id:</label>
                                <input id="routeId" type="text" placeholder="Route id" required v-model="routeId" class="text-input w-[12.3rem]">
                            </div>
                            <p ref="routeIdError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                        </div>
                        <!-- route mode drop down list -->
                        <div class="pl-4">
                            <div class="flex items-center justify-between">
                                <label for="routeMode" class="text-sm">Mode:</label>
                                <div>
                                    <select name="routeMode" id="routrouteModeeType" v-model="routeMode" class="dropdown-list w-[12.3rem]">
                                        <option disabled value="">Please select one</option>
                                        <option value="pt">Bus</option>
                                        <option value="tram">Tram</option>
                                        <option value="train">Train</option>
                                    </select> 
                                </div>
                            </div>
                            <p ref="routeModeError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                        </div>
                        <!-- departure section -->
                        <div>
                            <!-- departure drop down list -->
                            <div class="mb-2 pl-4">
                                <div class="flex items-center justify-between">
                                    <label for="departure" class="text-sm">Departure:</label>
                                    <div class="flex items-center">
                                        <select name="departure" id="departure" v-model="selectedDeparture" class="dropdown-list">
                                            <option value="">New departure</option>
                                            <option v-for="departure in departures" :key="departure._id" :value="departure._id">{{ departure._id }}</option>
                                        </select>
                                        <div v-if="selectedDeparture">
                                            <i @click="handleRemoveDeparture" class="fa-solid fa-circle-minus text-text-200 ml-4"></i>
                                        </div>
                                        <div v-else>
                                            <i @click="handleAddDeparture" class="fa-solid fa-circle-plus text-text-200 ml-4"></i>
                                        </div>
                                    </div>
                                </div>
                                <p ref="departureError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                            <!-- departure id input -->
                            <div class="pl-8">
                                <div class="flex items-center justify-between">
                                    <label for="departureId" class="text-sm">Id:</label>
                                    <input id="departureId" type="text" placeholder="Departure id" required v-model="departureId" class="text-input w-[12.3rem]">
                                </div>
                                <p ref="departureIdError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                            <!-- departure time input -->
                            <div class="pl-8">
                                <div class="flex items-center justify-between">
                                    <label for="departureTime" class="text-sm">Time:</label>
                                    <input id="routeId" type="time" step="1" required v-model="departureTime" class="text-input pb-0 w-[12.3rem]">
                                </div>
                                <p ref="departureTimeError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                            <!-- vehicle type drop down list -->
                            <div class="pl-8 mb-2">
                                <div class="flex items-center justify-between">
                                    <label for="vehicleType" class="text-sm">Vehicle:</label>
                                    <div>
                                        <select name="vehicleType" id="vehicleType" v-model="vehicleType" class="dropdown-list w-[12.3rem]">
                                            <option disabled value="">Please select one</option>
                                            <option v-for="type in vehicleTypes" :key="type._id" :value="type._id" >{{ type._id }}</option>
                                        
                                        </select> 
                                    </div>
                                </div>
                                <p ref="vehicleTypeError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                        </div>
                        <!-- stops section -->
                        <div>
                            <!-- stops buttons -->
                            <div class="mb-2 pl-4">
                                <div class="flex items-center justify-between">
                                    <label for="stops" class="text-sm">Stops:</label>
                                    <div>
                                        <i @click="handleResetStops" ref="resetStopsButton" class="fa-solid fa-rotate-left text-text-200 hover:text-primary-200 active:text-primary-300 ml-4"></i>
                                        <i @click="handleAddStops" ref="addStopsButton" class="fa-solid fa-circle-plus text-text-200 hover:text-primary-200 active:text-primary-300 ml-2"></i>   
                                    </div>
                                </div>
                                <p ref="stopsError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                            <!-- auto offset toggle -->
                            <div class="mb-2 pl-8">
                                <div class="flex items-center justify-between">
                                    <label for="autoOffset" class="text-sm">Auto Offset:</label>
                                    <input type="checkbox" name="autoOffset" value="autoOffset" v-model="autoOffset" class="before:content[''] peer relative h-4 w-4 cursor-default appearance-none rounded-md border border-gray-300 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-white before:opacity-0 before:transition-opacity checked:border-primary-200 checked:bg-primary-200 checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:h-[0.6125rem] checked:after:w-[0.275rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:absolute checked:after:ml-[0.32rem] checked:after:mt-[0.07rem] checked:after:block">
                                </div>
                                <p ref="pathError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                            <!-- stops pills -->
                            <div class="mb-2 pl-8 flex flex-wrap gap-1">
                                <div v-for="stop in stops" :key="stop" class="inline-block">
                                    <p @click="stops = stops.slice(0, stops.indexOf(stop))" class="rounded-full px-2 py-2 bg-primary-200 text-white text-xs font-medium cursor-pointer">{{ stop }}</p>
                                </div>
                            </div>
                        </div>
                        <!-- path section -->
                        <div>
                            <!-- path buttons -->
                            <div class="mb-2 pl-4">
                                <div class="flex items-center justify-between">
                                    <label for="path" class="text-sm">Path:</label>
                                    <div v-if="stops.length > 1">
                                        <i @click="handleResetPath" ref="resetPathButton" class="fa-solid fa-rotate-left text-text-200 ml-4 hover:text-primary-200 active:text-primary-300"></i>
                                        <i @click="handleAddToPath" ref="addToPathButton" class="fa-solid fa-circle-plus text-text-200 ml-2 hover:text-primary-200 active:text-primary-300"></i>   
                                    </div>
                                    <div v-else>
                                        <i class="fa-solid fa-rotate-left text-text-200 ml-4 opacity-50"></i>
                                        <i class="fa-solid fa-circle-plus text-text-200 ml-2 opacity-50"></i>   
                                    </div>
                                </div>
                                <p ref="pathError" class="invisible text-red-700 flex text-xs font-medium justify-end">error</p>
                            </div>
                            <!-- stops pills -->
                            <div class="mb-2 pl-4 flex flex-wrap gap-1">
                                <div v-for="link in path" :key="link" class="inline-block">
                                    <p @click="if (path.indexOf(link) !== 0) { path = path.slice(0, path.indexOf(link));}" class="rounded-full px-2 py-2 bg-primary-200 text-white text-xs font-medium cursor-pointer">{{ link }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script>
import Mapbox from "mapbox-gl"
import { onMounted, ref, watch, watchEffect } from "vue"
import { useRouter, useRoute } from 'vue-router'
import Heading from '../../../components/Heading'
import getStopFacilities from "@/composables/getStopFacilities"
import getLinks from '../../../composables/getLinks'
import getLink from '../../../composables/getLink'
import getConnectedLinks from '../../../composables/getConnectedLinks'
import getVehicleTypes from '../../../composables/getVehicleTypes'
import postStopFacility from '../../../composables/postStopFacility'
import postVehicleType from '../../../composables/postVehicleType'
import postLine from '../../../composables/postLine'

export default {
    components: { Heading },
    props: [],
    setup () {
        const route = useRoute()
        const router = useRouter()
        const { stopFacilities, error, load } = getStopFacilities()
        const { links, error: linksError, load: linksLoad } = getLinks()
        const { link, error: linkError, load: linkLoad } = getLink()
        const { links: connectedLinks, error: connectedLinksError, load: connectedLinksLoad } = getConnectedLinks()
        const { vehicleTypes, error: vehicleTypesError, load: vehicleTypesLoad } = getVehicleTypes()
        const { res: postStopFacilityRes, error: postStopFacilityError, post: postSF } = postStopFacility()
        const { res: postVehicleTypeRes, error: postVehicleTypeError, post: postVT } = postVehicleType()
        const { res: postLineRes, error: postLineError, post: postL} = postLine()
        
        let map
        const processing = ref(false)

        const isNumber = (e) => {
            if (e.code === 'Period' || e.code.includes('Digit')) {
                return true
            } else {
                e.preventDefault()
            }
        }

        const isInteger = (e) => {
            if (e.code.includes('Digit')) {
                return true
            } else {
                e.preventDefault()
            }
        }

        // function to convert time from hh:mm:ss format to sec
        const timeConverter = (timeInHMS) => {

            // split at colons
            let formattedTime = timeInHMS.split(':');
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            let timeInSeconds = (+formattedTime[0]) * 60 * 60 + (+formattedTime[1]) * 60 + (+formattedTime[2]);

            return timeInSeconds
        }

        // function to convert time from sec to hh:mm:ss format
        const reversedTimeConverter = (timeInSeconds) => {

            const timeInHMS = new Date(timeInSeconds * 1000).toISOString().slice(11, 19);

            return timeInHMS
        }

        const handleSave = async () => {

            // clear previous errors
            postLineError.value = null
            
            processing.value = true
            // async post line to db
            await postL(route.query.scenarioId, lineId.value, routes.value)
            processing.value = false

            if (!postLineError.value) {
                router.push({ name: 'Scenario Details', params: { id: route.query.scenarioId } })
            }
        }

        const handleCancel = () => {

            router.go(-1)

        }

        // add stop facility refs
        const addingStopFacility = ref(false)
        const toggleAddCoords = ref(false)
        const toggleAddReferenceLink = ref(false)
        const addCoordsButton = ref(null)
        const addReferenceLinkButton = ref(null)
        const stopFacilityId = ref('')
        const longitude = ref(null)
        const latitude = ref(null)
        const referenceLink = ref('')
        const isBlocking = ref(false)

        // add stop facility errors
        const stopFacilityIdError = ref(null)
        const longitudeError = ref(null)
        const latitudeError = ref(null)
        const linkRefError = ref(null)

        // add vehicle type refs
        const addingVehicleType = ref(false)
        const vehicleTypeId = ref('')
        const seats = ref(null)
        const standingCapacity = ref(null)
        const length = ref(null)
        const width = ref(null)

        // add vehicle type errors
        const vehicleTypeIdError = ref(null)
        const seatsError = ref(null)
        const standingCapacityError = ref(null)
        const lengthError = ref(null)
        const widthError = ref(null)

        // add line refs
        const lineId = ref('')
        const routeId = ref('')
        const selectedRoute = ref('')
        const routes = ref([])
        const routeMode = ref('')
        const departureId = ref('')
        const selectedDeparture = ref('')
        const departures = ref([])
        const departureTime = ref(null)
        const vehicleType = ref('')
        const stops = ref([])
        const addStopsButton = ref(null)
        const resetStopsButton = ref(null)
        const toggleAddStops = ref(false)
        const autoOffset = ref(true)
        const path = ref([])
        const addToPathButton = ref(null)
        const resetPathButton = ref(null)
        const toggleAddToPath = ref(false)

        // add line errors
        const lineIdError = ref(null)
        const routeError = ref(null)
        const routeIdError = ref(null)
        const routeModeError = ref(null)
        const departureError = ref(null)
        const departureIdError = ref(null)
        const departureTimeError = ref(null)
        const vehicleTypeError = ref(null)
        const stopsError = ref(null)
        const pathError = ref(null)

        // add facility functions
        const handleAddFacility = () => {
            
            toggleAddCoords.value = !toggleAddCoords.value
            
        }

        const handleAddReferenceLink = () => {

            toggleAddReferenceLink.value = !toggleAddReferenceLink.value

        }

        const handleCheckSF = async () => {

            const location = {
                type: 'Point',
                coordinates: [longitude.value, latitude.value]
            }

            await postSF(stopFacilityId.value, location, referenceLink.value, isBlocking.value)

            if (!postStopFacilityError.value) {
                // async get stop facilities again since a new facility added
                await load()
                // update stop facilities source
                const data = {
                    'type': 'FeatureCollection',
                    'features': []
                }

                for (const stopFacility of stopFacilities.value) {
                    if (stopFacility._id.includes('_b')) {
                        stopFacility.location.coordinates[0] -= 0.00010000011100
                    }
                    const item = {
                        'type': 'Feature',
                        'properties': {
                            'id': stopFacility._id
                        },
                        'geometry': stopFacility.location
                    }
                    data.features.push(item)
                }
                map.getSource('stopFacilities').setData(data)

                // process of adding a new stop facility completed - clear input
                stopFacilityId.value = ''
                longitude.value = null
                latitude.value = null
                referenceLink.value = ''
                isBlocking.value = false

                // clear links sources
                links.value = null
                map.getSource('links').setData({ 'type': 'FeatureCollection', 'features': [] })

                // cancel add coords
                toggleAddCoords.value = false

                // cancel add reference link
                toggleAddReferenceLink.value = false

                // minimize add stop facility
                addingStopFacility.value = false
            } else {
                // id error
                if (postStopFacilityError.value.errors._id) {
                    stopFacilityIdError.value.innerHTML = postStopFacilityError.value.errors._id
                    stopFacilityIdError.value.classList.remove('invisible')
                } else {
                    stopFacilityIdError.value.classList.add('invisible')
                }
                // longitude error
                if (postStopFacilityError.value.errors.longitude) {
                    longitudeError.value.innerHTML = postStopFacilityError.value.errors.longitude
                    longitudeError.value.classList.remove('invisible')
                } else {
                    longitudeError.value.classList.add('invisible')
                }
                // latitude error
                if (postStopFacilityError.value.errors.latitude) {
                    latitudeError.value.innerHTML = postStopFacilityError.value.errors.latitude
                    latitudeError.value.classList.remove('invisible')
                } else {
                    latitudeError.value.classList.add('invisible')
                }
                // reference link error
                if (postStopFacilityError.value.errors.linkRef) {
                    linkRefError.value.innerHTML = postStopFacilityError.value.errors.linkRef
                    linkRefError.value.classList.remove('invisible')
                } else {
                    linkRefError.value.classList.add('invisible')
                }
            } 
        }

        const handleCancelSF = () => {

            // process of adding a new stop facility cancelled - clear input
            stopFacilityId.value = ''
            longitude.value = null
            latitude.value = null
            referenceLink.value = ''
            isBlocking.value = false

            // clear links sources
            links.value = null
            map.getSource('links').setData({ 'type': 'FeatureCollection', 'features': [] })

            // cancel add coords
            toggleAddCoords.value = false

            // cancel add reference link
            toggleAddReferenceLink.value = false

            // minimize add stop facility
            addingStopFacility.value = false
        }

        // add vehicle type functions
        const handleAddVehicleType = () => {
            
            toggleAddCoords.value = !toggleAddCoords.value
            
        }

        const handleCheckVT = async () => {

            const vehicleType = {
                _id: vehicleTypeId.value,
                seats: seats.value,
                standingCapacity: standingCapacity.value,
                length: length.value,
                width: width.value
            }

            // clear previous errors
            postVehicleTypeError.value = null

            await postVT(vehicleType)

            if (!postVehicleTypeError.value) {
                // process of adding a new vehicle type completed - clear input
                vehicleTypeId.value = ''
                seats.value = null
                standingCapacity.value = null
                length.value = ''
                width.value = ''

                // minimize add stop facility
                addingVehicleType.value = false

                // clear error tags
                vehicleTypeIdError.value.innerHTML = null
                vehicleTypeIdError.value.classList.add('invisible')
                seatsError.value.innerHTML = null
                seatsError.value.classList.add('invisible')
                standingCapacityError.value.innerHTML = null
                standingCapacityError.value.classList.add('invisible')
                lengthError.value.innerHTML = null
                lengthError.value.classList.add('invisible')
                widthError.value.innerHTML = null
                widthError.value.classList.add('invisible')

            } else {
                // id error
                if (postVehicleTypeError.value.errors._id) {
                    vehicleTypeIdError.value.innerHTML = postVehicleTypeError.value.errors._id
                    vehicleTypeIdError.value.classList.remove('invisible')
                } else {
                    vehicleTypeIdError.value.classList.add('invisible')
                }
                // seats error
                if (postVehicleTypeError.value.errors.seats) {
                    seatsError.value.innerHTML = postVehicleTypeError.value.errors.seats
                    seatsError.value.classList.remove('invisible')
                } else {
                    seatsError.value.classList.add('invisible')
                }
                // standing capacity error
                if (postVehicleTypeError.value.errors.standingCapacity) {
                    standingCapacityError.value.innerHTML = postVehicleTypeError.value.errors.standingCapacity
                    standingCapacityError.value.classList.remove('invisible')
                } else {
                    standingCapacityError.value.classList.add('invisible')
                }
                // length error
                if (postVehicleTypeError.value.errors.length) {
                    lengthError.value.innerHTML = postVehicleTypeError.value.errors.length
                    lengthError.value.classList.remove('invisible')
                } else {
                    lengthError.value.classList.add('invisible')
                }
                // width error
                if (postVehicleTypeError.value.errors.width) {
                    widthError.value.innerHTML = postVehicleTypeError.value.errors.width
                    widthError.value.classList.remove('invisible')
                } else {
                    widthError.value.classList.add('invisible')
                }
            }
        }

        const handleCancelVT = () => {

            // process of adding a new stop facility cancelled - clear input
            vehicleTypeId.value = ''
            seats.value = null
            standingCapacity.value = null
            length.value = ''
            width.value = ''

            // minimize add stop facility
            addingVehicleType.value = false
        }

        // add line functions
        const handleAddRoute = () => {
            // front end validation needed ??
            // create a new route based on the form fields
            const newRoute = {
                _id: routeId.value,
                type: routeMode.value,
                stops: stops.value,
                path: path.value,
                departures: departures.value
            }
            // add the new route to routes array
            routes.value.push(newRoute)

            // set current route selection to newly added route
            selectedRoute.value = newRoute._id
        }

        const handleRemoveRoute = () => {
            routes.value = routes.value.filter(object => {
                return object._id !== routeId.value
            })
            selectedRoute.value = ''
        }

        const handleAddDeparture = () => {
            // front end validation needed ??
            // create a new route based on the form fields
            const newDeparture = {
                _id: departureId.value,
                departureTime: timeConverter(departureTime.value),
                vehicle: vehicleType.value
            }
            // add the new route to routes array
            departures.value.push(newDeparture)

            // set current departure selection to newly added departure
            selectedDeparture.value = newDeparture._id
        }

        const handleRemoveDeparture = () => {
            departures.value = departures.value.filter(object => {
                return object._id !== departureId.value
            })
            selectedDeparture.value = ''
        }

        const handleAddStops = () => {

            toggleAddStops.value = !toggleAddStops.value
            
        }

        const handleResetStops = () => {
            stops.value = []
        }

        const handleAddToPath = () => {

            toggleAddToPath.value = !toggleAddToPath.value

        }

        const handleResetPath = () => {

            path.value = path.value.slice(0, 1)

        }

        const handleFrontEndErrors = () => {

        }

        // watch functions
        watch(toggleAddCoords, () => {
            let colour
            let visibility

            if (toggleAddCoords.value) {
                addCoordsButton.value.classList.remove('text-text-200')
                colour = 'text-primary-200'
                visibility = 'visible'
            } else {
                addCoordsButton.value.classList.remove('text-primary-200')
                colour = 'text-text-200'
                visibility = 'none'
            }
            addCoordsButton.value.classList.add(colour)
            map.setLayoutProperty('stopFacilities', 'visibility', visibility)
        })

        watch(toggleAddReferenceLink, () => {
            let colour
            let visibility
            
            if (toggleAddReferenceLink.value) {
                addStopsButton.value.classList.remove('text-text-200')
                colour = 'text-primary-200'
                visibility = 'visible'
            } else {
                addStopsButton.value.classList.remove('text-primary-200')
                colour = 'text-text-200'
                visibility = 'none'
            }
            addStopsButton.value.classList.add(colour)
            map.setLayoutProperty('links', 'visibility', visibility)
        })

        watch(selectedRoute, () => {
            
            // get selected route object
            const routeObj = (routes.value.filter(obj => {
                return obj._id === selectedRoute.value
            })).at(0)

            // fill in form with route info
            if (routeObj) {
                routeId.value = routeObj._id
                routeMode.value = routeObj.type
                stops.value = routeObj.stops
                path.value = routeObj.path
                departures.value = routeObj.departures
                selectedDeparture.value = ''
            } else {
                routeId.value = ''
                routeMode.value = ''
                stops.value = []
                path.value = []
                departures.value = []
                selectedDeparture.value = ''
            }
        })

        /* watch for route section */

        watch(departures, () => {
            if (selectedRoute.value) {
                const index = routes.value.findIndex(i => i._id == selectedRoute.value)
                if (index  >= 0) {
                    routes.value[index].departures = departures.value
                }
                if (departures.value.length) {
                    departureIdError.value.classList.add('invisible')
                } else {
                    // departures error -> departures are required
                    departureError.value.innerHTML = 'At least one departure is required'
                    departureError.value.classList.remove('invisible')
                }
            }
            // update route object in routes array
            routes.value.departures = departures.value
        })

        // not checked yet
        watch(routeMode, () => {
            if (selectedRoute.value) {
                if (routeMode.value) {
                    const index = routes.value.findIndex(i => i._id == selectedRoute.value)
                    if (index  >= 0) {
                        routes.value[index].type = routeMode.value
                        routeModeError.value.classList.add('invisible')
                    }
                } else {
                    // route mode error -> route mode is required
                    routeModeError.value.innerHTML = 'Mode is required'
                    routeModeError.value.classList.remove('invisible')
                }
            }
        })

        /* ----------------------- */

        // watch for departure section
        
        watch(selectedDeparture, () => {

            // get selected departure object
            const departureObj = (departures.value.filter(obj => {
                return obj._id === selectedDeparture.value
            })).at(0)

            // fill in form with departure info
            if (departureObj) {
                departureId.value = departureObj._id
                departureTime.value = reversedTimeConverter(departureObj.departureTime)
                vehicleType.value = departureObj.vehicle
            } else {
                departureId.value = ''
                departureTime.value = ''
                vehicleType.value = ''
            }
        })

        watch(departureId, () => {
            if (selectedDeparture.value) {
                if (departureId.value) {
                    const index = departures.value.findIndex(i => i._id == selectedDeparture.value)
                    if (index  >= 0) {
                        departures.value[index]._id = departureId.value
                        selectedDeparture.value = departureId.value
                        departureIdError.value.classList.add('invisible')
                    }
                } else {
                    // id error -> id is required
                    departureIdError.value.innerHTML = 'Id is required'
                    departureIdError.value.classList.remove('invisible')
                }
            }
        })

        watch(departureTime, () => {
            if (departureTime.value && selectedDeparture.value) {
                const index = departures.value.findIndex(i => i._id == selectedDeparture.value)
                if (index >= 0) {
                    departures.value[index].departureTime = timeConverter(departureTime.value)
                }
            }
        })

        watch(vehicleType, () => {
            if (vehicleType.value && selectedDeparture.value) {
                const index = departures.value.findIndex(i => i._id == selectedDeparture.value)
                if (index >= 0) {
                    departures.value[index].vehicle = vehicleType.value
                }
            }
        })

        /* ----------------------- */

        /* watch for stops section */

        watch(stops, () => {
            if (stops.value[0]) {
                const sf = stopFacilities.value.filter((stopFacility) => {
                    return stops.value[0] === stopFacility._id
                })
                path.value[0] = sf[0].linkRef
            } else {
                // no stops selected
                // clear path
                path.value = []
                // toggle add to path button
                toggleAddToPath.value = false
            }
        }, { deep: true })

        /* ----------------------- */

        watch(routeMode, () => {
            vehicleTypesLoad()
            vehicleType.value = ''
        })

        watch(toggleAddStops, () => {
            let colour
            let visibility

            if (toggleAddStops.value) {
                addStopsButton.value.classList.remove('text-text-200')
                colour = 'text-primary-200'
                visibility = 'visible'
            } else {
                addStopsButton.value.classList.remove('text-primary-200')
                colour = 'text-text-200'
                visibility = 'none'
            }
            addStopsButton.value.classList.add(colour)
            // change visibility of stop facilities layer
            map.setLayoutProperty('stopFacilities', 'visibility', visibility)
        })

        watch(toggleAddToPath, () => {
            let colour
            let visibility

            if (toggleAddToPath.value) {
                addToPathButton.value.classList.remove('text-text-200')
                colour = 'text-primary-200'
                visibility = 'visible'
            } else {
                addToPathButton.value.classList.remove('text-primary-200')
                colour = 'text-text-200'
                visibility = 'none'
            }
            addToPathButton.value.classList.add(colour)
            // change visibility of stop facilities layer
            map.setLayoutProperty('connected-links', 'visibility', visibility)
        })

        watch(path, async () => {
            if (path.value.length) {
                // update connected links and connected links source based on last selected link
                await connectedLinksLoad(path.value[path.value.length - 1])
                // create source for links layer
                const data = {
                    'type': 'FeatureCollection',
                    'features': []
                }

                if (!connectedLinksError.value) {
                    for (const connectedLink of connectedLinks.value) {
                        const item = {
                            'type': 'Feature',
                            'properties': {
                                'id': connectedLink._id
                            },
                            'geometry': connectedLink.line
                        }
                        data.features.push(item)
                    }

                    map.getSource('connected-links').setData(data)
                } else {
                    // connected links error
                    if (connectedLinksError.value.errors.general) {
                        pathError.value.innerHTML = connectedLinksError.value.errors.general
                        pathError.value.classList.remove('invisible')
                    } else {
                        pathError.value.classList.add('invisible')
                    }
                }
            } else {
                // clear connected links and connected links source if no stop is selected (and thus path is empty)
                connectedLinks.value = null
                map.getSource('connected-links').setData({ 'type': 'FeatureCollection', 'features': [] })
            }
            
        }, { deep: true })

        watch(postLineError, () => {
            // hide error tags
            lineIdError.value.classList.add('invisible')
            routeError.value.classList.add('invisible')
            routeIdError.value.classList.add('invisible')
            routeModeError.value.classList.add('invisible')
            departureError.value.classList.add('invisible')
            departureIdError.value.classList.add('invisible')
            departureTimeError.value.classList.add('invisible')
            vehicleTypeError.value.classList.add('invisible')
            stopsError.value.classList.add('invisible')
            pathError.value.classList.add('invisible')

            if (postLineError.value) {
                // line id error
                if (postLineError.value.errors.id) {
                    lineIdError.value.innerHTML = postLineError.value.errors.id
                    lineIdError.value.classList.remove('invisible')
                } else {
                    lineIdError.value.classList.add('invisible')
                }
                // route error
                if (postLineError.value.errors.routes) {
                    routeError.value.innerHTML = postLineError.value.errors.routes
                    routeError.value.classList.remove('invisible')
                } else {
                    routeError.value.classList.add('invisible')
                }
                // route id error
                // route mode error
                // departure error
                // departure id error
                // departure time error
                // vehicle type error
                // stops error
                // path error
            }
        })

        watchEffect(async () => {
            if (longitude.value && latitude.value) {
                // clear previous errors
                linksError.value = null
                // hide error tags
                linkRefError.value.classList.add('invisible')

                // clear drop down list wiht reference links and links source
                links.value = null
                map.getSource('links').setData({ 'type': 'FeatureCollection', 'features': [] })

                // clear reference link
                referenceLink.value = ''

                // async load links within a 100-meter-radius from selected coordinates
                await linksLoad(longitude.value, latitude.value, 300)

                // create source for links layer
                const data = {
                    'type': 'FeatureCollection',
                    'features': []
                }

                if (!linksError.value) {
                    for (const link of links.value) {
                        const item = {
                            'type': 'Feature',
                            'properties': {
                                'id': link._id
                            },
                            'geometry': link.line
                        }
                        data.features.push(item)
                    }

                    map.getSource('links').setData(data)
                } else {
                    // reference link error
                    if (linksError.value.errors.linkRef) {
                        linkRefError.value.innerHTML = linksError.value.errors.linkRef
                        linkRefError.value.classList.remove('invisible')
                    } else {
                        linkRefError.value.classList.add('invisible')
                    }
                }
            }
        })

        // life cycle
        onMounted(async () => {
            Mapbox.accessToken = process.env.VUE_APP_MAPBOX_API_KEY
            // initialize map
            map = new Mapbox.Map({
                container: 'map', // container ID
                // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
                style: 'mapbox://styles/mapbox/streets-v12', // style URL
                center: [14.333540, 51.757856], // starting position [lng, lat]
                zoom: 9 // starting zoom
            })

            map.on('click', 'stopFacilities', (e) => {
                const bbox = [
                    [e.point.x - 5, e.point.y - 5],
                    [e.point.x + 5, e.point.y + 5]
                ];
                const selectedFeatures = map.queryRenderedFeatures(bbox, {
                    layers: ['stopFacilities']
                })
                const newStopFacility = selectedFeatures[0].properties.id
                if (toggleAddStops.value) {
                    const index = stops.value.indexOf(newStopFacility)
                    if (index === -1) {
                        stops.value.push(selectedFeatures[0].properties.id)
                    } else {
                        stops.value = stops.value.slice(0, index)
                    } 
                }
            })

            map.on('click', (e) => {
                if (toggleAddCoords.value) {
                    longitude.value = e.lngLat.lng
                    latitude.value = e.lngLat.lat
                }
            })

            map.on('click', 'links', (e) => {
                const bbox = [
                    [e.point.x - 5, e.point.y - 5],
                    [e.point.x + 5, e.point.y + 5]
                ];
                const selectedFeatures = map.queryRenderedFeatures(bbox, {
                    layers: ['links']
                })
                referenceLink.value = selectedFeatures[0].properties.id
            })

            map.on('click', 'connected-links', (e) => {
                const bbox = [
                    [e.point.x - 5, e.point.y - 5],
                    [e.point.x + 5, e.point.y + 5]
                ];
                const selectedFeatures = map.queryRenderedFeatures(bbox, {
                    layers: ['connected-links']
                })
                path.value.push(selectedFeatures[0].properties.id)
            })

            map.on('load', () => {

                // create source for stop facilities layer
                const data = {
                    'type': 'FeatureCollection',
                    'features': []
                }

                for (const stopFacility of stopFacilities.value) {
                    if (stopFacility._id.includes('_b')) {
                        stopFacility.location.coordinates[0] -= 0.00010000011100
                    }
                    const item = {
                        'type': 'Feature',
                        'properties': {
                            'id': stopFacility._id
                        },
                        'geometry': stopFacility.location
                    }
                    data.features.push(item)
                }

                map.addSource('stopFacilities', {
                    'type': 'geojson',
                    'data': data
                })

                // Add a stop facilities layer
                map.addLayer({
                    'id': 'stopFacilities',
                    'type': 'symbol',
                    'source': 'stopFacilities',
                    'layout': {
                        'icon-image': 'marker',
                        'icon-size': 1.5,
                        'icon-ignore-placement': true,
                        // get the title name from the source's "id" property
                        'text-field': ['get', 'id'],
                        'text-offset': [0, 1.25],
                        'text-anchor': 'top'
                    }
                })
                map.setLayoutProperty('stopFacilities', 'visibility', 'none')


                // create source for links layer
                map.addSource('links', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': []
                    }
                })

                // add links layer
                map.addLayer({
                    'id': 'links',
                    'type': 'line',
                    'source': 'links',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#888',
                        'line-width': 8
                    }
                })
                map.setLayoutProperty('links', 'visibility', 'none')

                // create source for connected links layer
                map.addSource('connected-links', {
                    'type': 'geojson',
                    'data': {
                        'type': 'FeatureCollection',
                        'features': []
                    }
                })

                // add connected links layer
                map.addLayer({
                    'id': 'connected-links',
                    'type': 'line',
                    'source': 'connected-links',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#888',
                        'line-width': 8
                    }
                })
                map.setLayoutProperty('connected-links', 'visibility', 'none')

                // const url = 'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png'
                // map.loadImage(url, (err, image) => {
                //     if (err) { return; }
                //     map.addImage('arrow', image)
                //     map.addLayer({
                //         'id': 'arrowId',
                //         'type': 'symbol',
                //         'source': 'links',
                //         'layout': {
                //             'symbol-placement': 'line',
                //             'symbol-spacing': 1,
                //             'icon-allow-overlap': true,
                //             // 'icon-ignore-placement': true,
                //             'icon-image': 'arrow',
                //             'icon-size': 0.045,
                //             'visibility': 'visible'
                //         }
                //     })
                // })
            })
        })

        // stop facilities first load
        load()

        return { 
            processing, stopFacilities, error, links, addingStopFacility, addCoordsButton, 
            addReferenceLinkButton, stopFacilityId, longitude, latitude, referenceLink, 
            isBlocking, stopFacilityIdError, longitudeError, latitudeError, linkRefError, 
            addingVehicleType, vehicleTypeId, seats, standingCapacity, length, width, 
            vehicleTypeIdError, seatsError, standingCapacityError, lengthError, 
            widthError, lineId, routeId, selectedRoute, routes, routeMode, departureId, selectedDeparture, departures, 
            departureTime, vehicleType, vehicleTypes, stops, addStopsButton, resetStopsButton, autoOffset, path, addToPathButton, 
            resetPathButton,
            lineIdError, routeError, routeIdError, 
            routeModeError, departureError, departureIdError, departureTimeError, 
            vehicleTypeError, stopsError, pathError,
            handleSave, handleCancel, isNumber, isInteger, handleAddFacility, 
            handleAddReferenceLink, handleCheckSF, handleAddVehicleType, 
            handleCancelSF, handleCheckVT, handleCancelVT, handleAddRoute, handleRemoveRoute, handleAddDeparture, handleRemoveDeparture, 
            handleAddStops, handleResetStops, handleAddToPath, handleResetPath
        }
    }
}
</script>

<style>

</style>