import { ref } from 'vue'

const getConnectedLinks = () => {
    const links = ref(null)
    const error = ref(null)

    const load = async (linkId) => {
        try {
            const data = await fetch(`http://localhost:4000/api/scenarios/get-connected-links/${linkId}`)
            if (!data.ok) {
                throw ((await data.json()))
            }
            links.value = (await data.json()).links
        } catch (err) {
            error.value = err
            console.log(error.value)
        }
    }

    return { links, error, load }
}

export default getConnectedLinks