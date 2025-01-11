export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const { API_KEY } = config
    const query = getQuery(event)
    const lat = query.lat
    const lon = query.lon

    if(lat && lon){
        const url = `${config.public.apiBase}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
        const data = await $fetch(url)
        console.log("url: ", url.split('appid')[0])
        return data
    }else{
        return null
    }
    
})