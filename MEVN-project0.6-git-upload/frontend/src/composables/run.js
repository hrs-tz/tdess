import { ref } from 'vue'

const run = () => {
    const res = ref(null)
    const error = ref(null)

    const post = async (scenarioId, iters) => {
        try {
            const data = await fetch('http://localhost:4000/api/home/run-matsim', {
                method: 'POST',
                body: JSON.stringify({
                  scenarioId: scenarioId,
                  iters: iters
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

export default run