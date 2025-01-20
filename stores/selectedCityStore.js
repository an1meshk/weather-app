import { defineStore } from "pinia";
import { SELECTED_OPTION_KEY } from "~/utils/constant";

export const useSelectedCity = defineStore('selectedCityStore',() => {
    const selectedCity = ref(null)

    const getSelectedCity = () => {
            if(selectedCity.value !== null) return selectedCity.value
    
            try{
                if (localStorage.getItem(SELECTED_OPTION_KEY)) {
                    selectedCity.value = JSON.parse(localStorage.getItem(SELECTED_OPTION_KEY))
                }
            }catch (err){
                console.error('failed to fetch selected option location')
            }finally{
                return selectedCity.value
            }
        }

    const updateSelectedCity = (newOption) => {
        try{
            selectedCity.value = newOption
            localStorage.setItem(SELECTED_OPTION_KEY, JSON.stringify(selectedCity.value))
        }catch (err) {
            console.error('failed to update selected option location')
        }
    }

    return {
        selectedCity,
        getSelectedCity,
        updateSelectedCity
    }
})