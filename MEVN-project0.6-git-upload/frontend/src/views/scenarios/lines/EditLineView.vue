<template>
    <div>
        <Heading/>
    </div>
    <div class="main-body">
        <div class="w-2/3 h-full pr-2 pl-1">
            <div id='map' class="h-full z-10"></div>
        </div>
        <div class="w-1/3 h-full overflow-y-auto pl-2 pr-1">
            <div v-for="link in links" :key="link._id">
                <p>{{ link._id }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import Mapbox from "mapbox-gl"
import { onMounted, ref } from "vue"
import { useRouter, useRoute } from 'vue-router'
import getLine from '../../../composables/getLine'
import Heading from '../../../components/Heading'

export default {
    components: { Heading },
    props: [],
    setup () {
        const route = useRoute()
        const { line, links, error, load } = getLine(route.params.id)
        const path = ref([])
        let map

        onMounted(async () => {
            await load()
            Mapbox.accessToken = process.env.VUE_APP_MAPBOX_API_KEY
            // initialize map
            map = new Mapbox.Map({
                container: 'map', // container ID
                // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
                style: 'mapbox://styles/mapbox/streets-v12', // style URL
                center: [14.333540, 51.757856], // starting position [lng, lat]
                zoom: 9 // starting zoom
            })

            // create a default Marker and add it to the map.
            const marker = new Mapbox.Marker()
                .setLngLat([14.333540, 51.757856])
                .addTo(map)

            for (const link of links.value) {
                path.value.push(link.line.coordinates.at(0))
                path.value.push(link.line.coordinates.at(1))
            }

            map.on('load', () => {
                map.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': path.value
                        }
                    }
                })
                map.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#888',
                        'line-width': 8
                    }
                })
            })
        })

        // load()

        return { line, links, error }
    }
}
</script>

<style>

</style>