import { ref } from 'vue'

const patchScenario = () => {
    const res = ref(null)
    const error = ref(null)

    const patch = async (newDescription, scenario) => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/patch-scenario', {
                method: 'PATCH',
                body: JSON.stringify({
                  _id: scenario._id,
                  score: scenario.score,
                  avgTravelTime: scenario.avgTravelTime,
                  avgTransits: scenario.avgTransits,
                  numberOfVehicles: scenario.numberOfVehicles,
                  description: newDescription
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            })
            if (!data.ok) {
                throw ((await data.json()))
            }
            res.value = (await data.json())

            
        } catch (err) {
            error.value = err
            console.log(error.value)
        }
    }

    return { res, error, patch }
}

export default patchScenario