import { ref } from 'vue'

const postScenario = () => {
    const res = ref(null)
    const error = ref(null)

    const post = async (scenarioId, description) => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/post-scenario', {
                method: 'POST',
                body: JSON.stringify({
                  scenarioId: scenarioId,
                  description: description
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

    return { res, error, post }
}

export default postScenario