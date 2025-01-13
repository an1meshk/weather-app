export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const { API_KEY } = config
    const query = getQuery(event)
    const lat = query.lat
    const lon = query.lon
    const unit = query.unit ?? 'imperial'

    if(lat && lon){
        const url = `${config.public.apiBase}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`;
        const data = await $fetch(url)
        console.log("url: ", url.split('appid')[0])
        return data
    }else{
        return null
    }
    
})