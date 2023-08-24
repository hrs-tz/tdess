import { ref } from 'vue'

const getScenarios = () => {
    const scenarios = ref([])
    const error = ref(null)

    const load = async () => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/get-scenarios')
            if (!data.ok) {
                throw Error('No data available')
            }
            scenarios.value = (await data.json()).scenarios
        } catch (err) {
            error.value = err.message
            console.log(error.value)
        }
    }

    return { scenarios, error, load }
}

export default getScenarios