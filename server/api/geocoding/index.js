export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig(event)
    const { API_KEY } = config
    const query = getQuery(event)
    const searchQuery = query.searchText

    if(searchQuery){
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${searchQuery}&limit=5&appid=${API_KEY}`;

        const data = await $fetch(url)
        return data
    }else{
        return null
    }
})