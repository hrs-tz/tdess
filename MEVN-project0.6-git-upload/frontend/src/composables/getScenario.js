import { ref } from 'vue'

const getScenario = (id) => {
    const scenario = ref(null)
    const error = ref(null)
    const lines = ref(null)

    const load = async () => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/get-scenario?scenarioId=' + id)
            if (!data.ok) {
                throw Error('error loading the scenario')
            }
            scenario.value = (await data.json()).scenario

            const dataLines = await fetch('http://localhost:4000/api/scenarios/get-lines?scenarioId=' + id)
            if (!dataLines.ok) {
                throw Error('Error loading the lines of the scenario')
            }
            lines.value = (await dataLines.json()).lines
        } catch (err) {
            error.value = err
            console.log(error.value)
        }
    }

    return { scenario, lines, error, load }
}

export default getScenario