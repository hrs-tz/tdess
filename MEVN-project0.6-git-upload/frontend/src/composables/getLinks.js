import { ref } from 'vue'

const getLinks = () => {
    const links = ref(null)
    const error = ref(null)

    const load = async (longitude, latitude, radius) => {
        console.log(longitude)
        console.log(latitude)
        try {
            const data = await fetch(`http://localhost:4000/api/scenarios/get-links?longitude=${longitude}&latitude=${latitude}&radius=${radius}`)
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

export default getLinks