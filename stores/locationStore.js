import { defineStore } from "pinia";
import { STORED_LOCATION_KEY } from "~/utils/constant";
import cloneDeep from 'lodash.clonedeep';

export const useLocationStore = defineStore('locationStore',() => {
    const locationArray = ref([])

    const getLocation = () => {
        if(locationArray.value.length != 0) return locationArray.value

        try{
            if (localStorage.getItem(STORED_LOCATION_KEY)) {
                locationArray.value = JSON.parse(localStorage.getItem(STORED_LOCATION_KEY))
            }
        }catch (err){
            console.error('failed to fetch tracked locations')
        }finally{
            return cloneDeep(locationArray.value)
        }
    }

    const addLocation = (locationObj) => {
        try{
            locationArray.value.push(locationObj)
            localStorage.setItem(STORED_LOCATION_KEY, JSON.stringify(locationArray.value))
        }catch (err) {
            console.error('failed to add location')
        }
    }

    const removeStoredLocation = (locationId) => {
        try{
            const cities = locationArray.value
            const updatedCities = cities.filter((city) => city.id !== locationId)
    
            localStorage.setItem(STORED_LOCATION_KEY, JSON.stringify(updatedCities))
            locationArray.value = updatedCities
        }catch (err) {
            console.error('failed to remove tracked locations')
        }
    }

    return{
        getLocation,
        addLocation,
        removeStoredLocation
    }
})