<template>
    <ClientOnly>
        <div>
            <div v-if="savedLocations.length > 0">
                <div v-for="city in savedLocations" :key="city.id" class="py-2">
                    <CityCard :city="city" @click="goToCityView(city)" :isLoading="isLoading" />
                </div>
            </div>
            <div v-else>
                <p>No locations added. To start tracking a location, search in the field above.</p>
            </div>
        </div>
    </ClientOnly>
</template>

<script setup>
import { useUnitStore } from '~/stores/unitStore';
import { useLocationStore } from '~/stores/locationStore';


const unitStore = useUnitStore();
const locationStore = useLocationStore();
const savedLocations = ref([])
const isLoading = ref(false)
const unit = computed(() => unitStore.currentUnit)

const getCities = async () => {
    try {
        savedLocations.value = locationStore.getLocation()

        const requests = []
        savedLocations.value.forEach((city) => {
            requests.push(
                $fetch('/api/weather', {
                    query: {
                        lat: city.coords.lat,
                        lon: city.coords.lon,
                        unit: unit.value
                    }
                })
            )
        })

        const weatherData = await Promise.all(requests)

        //Flicker Delay
        await new Promise((res) => setTimeout(res, 500))

        weatherData.forEach((value, index) => {
            savedLocations.value[index].weather = value
        })
    } catch (err) {

    }
}

onMounted(async () => {
    try {
        isLoading.value = true
        await getCities()
    } catch (err) {

    } finally {
        isLoading.value = false
    }
});

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

watch(unit, async (newUnit, oldUnit) => {
    if (newUnit !== oldUnit) {
        try {
            isLoading.value = true
            await getCities();
        } catch (err) {

        } finally {
            isLoading.value = false
        }
    }
});

</script>
