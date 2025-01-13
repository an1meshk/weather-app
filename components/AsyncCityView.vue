<template>
    <div v-if="isError" class="flex flex-col items-center text-white py-10">Oh, snapp! something went wrong, try
        again.</div>
    <div v-else class="flex flex-col flex-1 items-center mx-4 my-2">
        <!-- Banner -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>You are currently previewing {{ route.params.city }}'s weather. Click the "+" icon to start tracking
                this location
            </p>
        </div>
        <!-- Weather Overview -->
        <div class="flex flex-col items-center text-white py-6">
            <h1 class="text-4xl mb-2 text-center text-wrap">
                {{ `${route.params.city},
                ${route.query.state ??
                    route.params.country}`
                }}</h1>
            <div class="text-sm mb-8 text-center">
                <p>
                    {{
                        `${getLocalTimeFromOffsetArr()[0]} ${getLocalTimeFromOffsetArr()[1]}
                    ${getLocalTimeFromOffsetArr()[2]}`
                    }}
                </p>
                <p>
                    {{
                        `${getLocalTimeFromOffsetArr()[4]}`
                    }}
                </p>
            </div>
            <p class="text-8xl mb-6">
                {{ Math.round(weatherData.main.temp) }}&deg; {{ getUnitAbbrv() }}
            </p>
            <div class="text-center">
                <p>
                    Feels like: {{ Math.round(weatherData.main.feels_like) }}&deg;
                </p>
                <div class="flex py-1 justify-between">
                    <p class="w-1/2">Max: {{ Math.round(weatherData.main.temp_max) }}&deg;</p>
                    <p class="w-1/2">Min: {{ Math.round(weatherData.main.temp_min) }}&deg;</p>
                </div>
                <p class="capitalize">
                    {{ weatherData.weather[0].description }}
                </p>
                <img class="w-[150px] h-auto"
                    :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
                    alt="weather-icon" />
            </div>
            <hr class="border-white border-opacity-10 border w-full" />

            <div class="flex flex-col py-1 text-center">
                <h1 class="text-center text-xl">Wind</h1>
                <p>Speed: {{ Math.round(weatherData.wind.speed) }} mph</p>
                <p v-if="weatherData.wind.gust">Gust: {{ Math.round(weatherData.wind.gust) }} mph</p>
                <p>Direction: {{ Math.round(weatherData.wind.deg) }}&deg;</p>
            </div>
        </div>
        <div v-if="!route.query.preview"
            class="flex items-center gap-3 py-4 text-white cursor-pointer duration-150 hover:font-red-500"
            @click="removeCity">
            <i class="fa-solid fa-trash"></i>
            <p>Remove Location</p>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useUnitStore } from '~/stores/unitStore';

const unitStore = useUnitStore();
const isError = ref(false)
const route = useRoute()
const isUnitMetric = ref(false)
const weatherData = ref(null);
const unit = computed(() => unitStore.currentUnit)

const getWeatherData = async () => {
    try {
        const data = await $fetch('/api/weather', {
            query: {
                lat: route.query.lat,
                lon: route.query.lon,
                unit: unit.value
            }
        })

        //Flicker Delay
        await new Promise((res) => setTimeout(res, 500))

        weatherData.value = data
    } catch (err) {
        isError.value = true
        showError({
            statusCode: 500,
            message: "Oh, snapp! something went wrong. Could not get the weather information. Please try again"
        })
    }
}
await getWeatherData();

const removeCity = async () => {

    const cities = JSON.parse(localStorage.getItem('savedCities'))
    const updatedCities = cities.filter((city) => city.id !== route.query.id)

    localStorage.setItem('savedCities', JSON.stringify(updatedCities))

    await navigateTo('/')
}

const getLocalTimeFromOffsetArr = () => {
    if (!weatherData.value) return

    const timezoneOffset = weatherData.value.timezone;
    const dt = weatherData.value.dt
    const localTimestamp = dt + timezoneOffset; // Offset is in seconds, dt is in seconds
    const localDate = new Date(localTimestamp * 1000); // Convert to milliseconds

    const localTime = localDate.toUTCString().replace("GMT", "GMT+" + timezoneOffset / 3600);
    const dateTimeArr = localTime.split(" ")
    return dateTimeArr;
}

const getUnitAbbrv = () => {
    return isUnitMetric.value ? "C" : "F"
}

watchEffect(async () => {
    await getWeatherData();
    isUnitMetric.value = unitStore.isMetricUnit
});

</script>
