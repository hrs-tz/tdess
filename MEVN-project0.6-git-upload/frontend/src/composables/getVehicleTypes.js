import { ref } from 'vue'

// in comments -> code to get vehicle types based on a spicific mode
const getVehicleTypes = () => {
    const vehicleTypes = ref([])
    const error = ref(null)

    const load = async () => {
    // const load = async (mode) => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/get-vehicle-types')
            // const data = await fetch('http://localhost:4000/api/scenarios/get-vehicle-types?mode=' + mode)
            if (!data.ok) {
                throw Error('No data available')
            }
            vehicleTypes.value = (await data.json()).vehicleTypes
        } catch (err) {
            error.value = err.message
            console.log(error.value)
        }
    }

    return { vehicleTypes, error, load }
}

export default getVehicleTypes