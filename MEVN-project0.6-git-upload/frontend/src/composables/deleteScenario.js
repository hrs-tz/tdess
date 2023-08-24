import { ref } from 'vue'

const deleteScenario = () => {
    const res = ref(null)
    const error = ref(null)

    const remove = async (scenarioId) => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/delete-scenario', {
                method: 'DELETE',
                body: JSON.stringify({
                  scenarioId: scenarioId
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

    return { res, error, remove }
}

export default deleteScenario