<template>
    <div class="relative inline-block w-[300px]">
        <!-- Dropdown Button -->
        <button @click="toggleDropdown"
            class="bg-weather-secondary px-4 py-2 rounded-md w-full flex items-center justify-between min-w-0">
            <span v-if="selectedOption" class="truncate max-w-[250px]">{{ selectedOption.city }}, {{
                selectedOption.state
                ??
                selectedOption.country
            }}</span>
            <span v-else>Select an option</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-[20px] w-[20px] transform"
                :class="{ 'rotate-180': isOpen }" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                    d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd" />
            </svg>
        </button>

        <!-- Dropdown List -->
        <ul v-if="isOpen" class="absolute z-10 bg-weather-secondary shadow-lg rounded w-full mt-[2px] min-w-0">
            <li v-for="(option, index) in options" :key="index" @click="selectOption(option)"
                class="px-4 py-2 hover:bg-gray-500 cursor-pointer truncate">
                {{ option.city }}, {{ option.state ?? option.country }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useLocationStore } from '~/stores/locationStore';
import { useSelectedCity } from '~/stores/selectedCityStore';
import cloneDeep from 'lodash.clonedeep';

const emit = defineEmits(['option-selected'])

const locationStore = useLocationStore();
const selectedCityStore = useSelectedCity();
const options = computed(() => {
    const trackedLocations = cloneDeep(locationStore.getLocation())
    return trackedLocations
})

const isOpen = ref(false)
const selectedOption = computed(() => selectedCityStore.getSelectedCity())

const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
}
const selectOption = (option) => {
    selectedCityStore.updateSelectedCity(option)
    isOpen.value = false;
    emit("option-selected", option);
}
</script>
