import { ref } from 'vue'

const getDepartures = () => {
    const departures = ref(null)
    const error = ref(null)

    const load = async (scenarioId) => {
        try {
            const data = await fetch('http://localhost:4000/api/home/get-departures?scenarioId=' + scenarioId)
            if (!data.ok) {
                throw Error('Error loading the departures')
            }
            departures.value = (await data.json()).departures
        } catch (err) {
            error.value = err
            console.log(error.value)
        }
    }

    return { departures, error, load }
}

export default getDepartures