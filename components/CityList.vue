<template>
    <ClientOnly>
        <div class="p-2">
            <template v-if="savedLocations.length > 0">
                <h1 class="text-xl mb-2 text-center">Drag up/down to arrange your weather cards</h1>
                <!-- Draggable container -->
                <draggable v-model="savedLocations" group="people" animation="200" @end="onDragEnd" @start="onDragStart"
                    item-key="id" :class="{ 'dragging': isDragging }">
                    <template #item="{ element: city }">
                        <div class="py-2">
                            <CityCard :city="city" @click="goToCityView(city)" :isLoading="isLoading" />
                        </div>
                    </template>
                </draggable>
            </template>
            <div v-else>
                <p>No locations added. To start tracking a location, search in the field above.</p>
            </div>
        </div>
    </ClientOnly>
</template>

<script setup>
import { useUnitStore } from '~/stores/unitStore';
import { useLocationStore } from '~/stores/locationStore';
import { useSelectedCity } from '~/stores/selectedCityStore';
import cloneDeep from 'lodash.clonedeep';
import draggable from 'vuedraggable'

const unitStore = useUnitStore();
const locationStore = useLocationStore();
const selectedCityStore = useSelectedCity()
const savedLocations = ref([])
const isLoading = ref(false)
const isDragging = ref(false)
const unit = computed(() => unitStore.currentUnit)

const getCities = async () => {
    try {
        savedLocations.value = cloneDeep(locationStore.getLocation())

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
    selectedCityStore.updateSelectedCity(city)
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

const onDragEnd = () => {
    isDragging.value = false
    locationStore.replaceWithNewArrangedLocationList(cloneDeep(savedLocations.value))
};

const onDragStart = () => {
    isDragging.value = true
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

<style>
.dragging {
    opacity: 0.8;
}
</style>