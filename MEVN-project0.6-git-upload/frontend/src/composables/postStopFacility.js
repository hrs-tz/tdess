import { ref } from 'vue'

const postStopFacility = () => {
    const res = ref(null)
    const error = ref(null)

    const post = async (_id, location, linkRef, isBlocking) => {
        try {
            const data = await fetch('http://localhost:4000/api/scenarios/post-stop-facility', {
                method: 'POST',
                body: JSON.stringify({
                  _id: _id,
                  location: location,
                  linkRef: linkRef,
                  isBlocking: isBlocking
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

export default postStopFacility