import { ref } from 'vue'

const getLink = () => {
    const link = ref(null)
    const error = ref(null)

    const load = async (linkId) => {
        try {
            const data = await fetch(`http://localhost:4000/api/scenarios/get-link/${linkId}`)
            if (!data.ok) {
                throw ((await data.json()))
            }
            link.value = (await data.json()).link
        } catch (err) {
            error.value = err
            console.log(error.value)
        }
    }

    return { link, error, load }
}

export default getLink