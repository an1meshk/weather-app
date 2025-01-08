export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const {API_KEY} = config
    const query = getQuery(event)
    const lat = query.lat
    const lon = query.lon

    if(lat && lon){
        
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
        const data = await $fetch(url)
    
        return data
    }else{
        return null
    }
    
})