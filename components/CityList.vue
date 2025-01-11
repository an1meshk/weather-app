<template>
    <div>
        <div v-if="isFetching == true">
            <CityCardSkeleton />
        </div>
        <template v-else-if="savedCities.length !== 0">
            <div v-for="city in savedCities" :key="city.id" class="py-2">
                <CityCard :city="city" @click="goToCityView(city)" />
            </div>
        </template>
        <div v-else>
            <p>No locations added. To start tracking a location, search in the field above.</p>
        </div>
    </div>
</template>

<script setup>
const savedCities = ref([])
const isFetching = ref(false)

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
            }, {
                client: true
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

try {
    isFetching.value = true
    await getCities()
} catch {

} finally {
    isFetching.value = false
}

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
