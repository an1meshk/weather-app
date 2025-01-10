<template>
    <div v-for="city in savedCities" :key="city.id">
        <CityCard :city="city" @click="goToCityView(city)" />
    </div>
    <p v-if="savedCities?.length === 0">
        No locations added. To start tracking a location, search in the field above.
    </p>
</template>

<script setup>
const savedCities = ref([])
const getCities = async () => {
    try {
        if (localStorage.getItem('savedCities')) {
            savedCities.value = JSON.parse(localStorage.getItem('savedCities'))
        }
    } catch {

    }
    const requests = []
    savedCities.value.forEach((city) => {
        requests.push(
            useFetch('/api/weather', {
                query: {
                    lat: city.coords.lat,
                    lon: city.coords.lon
                }
            })
        )
    })

    const weatherData = await Promise.all(requests)

    //Flicker Delay
    await new Promise((res) => setTimeout(res, 500))

    weatherData.forEach((value, index) => {
        savedCities.value[index].weather = value.data
    })
}

await getCities()

const goToCityView = async (city) => {
    const routePath = `weather/${city.city}~${city.country}`

    await navigateTo(
        {
            path: routePath,
            query: {
                lat: city.coords.lat,
                lon: city.coords.lon,
                id: city.id,
                state: city.state
            }
        }
    )
}
</script>
