import { defineStore } from "pinia";

export const useSelectedCity = defineStore('selectedCityStore',() => {
    const selectedCity = ref(null)

    const updateSelectedCity = (newOption) => {
        selectedCity.value = newOption
    }

    return {
        selectedCity,
        updateSelectedCity
    }
})