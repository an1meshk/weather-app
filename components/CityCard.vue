<template>
    <div class="flex py-6 px-3 bg-weather-secondary rounded-md shadow-md cursor-pointer">
        <div class="flex flex-col flex-1 min-w-0">
            <h2 class="text-3xl truncate">{{ city.city }}</h2>
            <h3>{{ city.state ?? city.country }}</h3>
        </div>
        <div v-if="city?.weather?.main" class="flex flex-col gap-2">
            <p class="text-3xl self-end">{{ Math.round(city.weather?.main.temp) }}&deg{{ getUnitAbbrv() }}
            </p>
            <div class="flex gap-2">
                <span class="text-xs">
                    H: {{ Math.round(city.weather?.main.temp_max) }}&deg
                </span>
                <span class="text-xs">
                    L: {{ Math.round(city.weather?.main.temp_min) }}&deg
                </span>
            </div>
        </div>
        <div v-else-if="!isLoading" class="flex flex-col gap-2">
            <p class="text-sm self-end">Data Unavailable</p>
        </div>
        <div v-else-if="isLoading" class="flex flex-col gap-2">
            <AnimatedPlaceholder class="w-[75px]" />
        </div>
    </div>
</template>

<script setup>
import { useUnitStore } from '~/stores/unitStore';

defineProps({
    city: {
        type: Object,
        default: () => { }
    },
    isLoading: {
        type: Boolean,
        default: false
    }
})

const unitStore = useUnitStore();
const isLocalUnitMetric = computed(() => unitStore.isMetricUnit)

const getUnitAbbrv = () => {
    return isLocalUnitMetric.value ? "C" : "F"
}

</script>
