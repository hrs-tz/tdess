import { ref } from 'vue'

const getLine = (id) => {
    const line = ref(null)
    const links = ref(null)
    const error = ref(null)

    const load = async () => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/get-line/' + id)
            if (!data.ok) {
                throw Error('error loading the line')
            }
            const res = await data.json()
            line.value = res.line
            links.value = res.links
        } catch (err) {
            error.value = err
            console.log(error.value)
        }
    }

    return { line, links, error, load }
}

export default getLine