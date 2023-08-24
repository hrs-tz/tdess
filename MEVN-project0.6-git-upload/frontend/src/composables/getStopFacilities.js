import { ref } from 'vue'

const getStopFacilities = () => {
    const stopFacilities = ref(null)
    const error = ref(null)

    const load = async () => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/get-stop-facilities')
            if (!data.ok) {
                throw Error('error loading stop facilities')
            }
            stopFacilities.value = (await data.json()).stopFacilities
        } catch (err) {
            error.value = err
            console.log(error.value)
        }
    }

    return { stopFacilities, error, load }
}

export default getStopFacilities