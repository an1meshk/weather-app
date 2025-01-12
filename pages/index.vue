<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <div class="flex items-center gap-3 justify-between">
                <input v-model="searchQuery" @input="debouncedSearch" type="text" placeholder="Search for a location"
                    class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-sm"
                    maxlength="35">
                <i v-if="searchQuery" class="fa-solid fa-xmark w-[10px]" @click="clearInput"></i>
            </div>
            <ul v-if="searchQuery?.length !== 0 && (searchResults || searchError)"
                class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
                <p v-if="searchError">Oh, snapp! something went wrong, try again.</p>

                <p v-else-if="!searchError && searchResults?.length === 0">No results match your input, try a different
                    location.
                </p>

                <template v-else>
                    <li v-for="searchResult in searchResults" :key="searchResult.lat" class="py-2 cursor-pointer"
                        @click="previewCity(searchResult)">
                        {{ `${searchResult.name}, ${searchResult.state ? searchResult.state + ',' : ''}
                        ${searchResult.country}` }}
                    </li>
                </template>
            </ul>
        </div>
        <div class="flex flex-col gap-3 mb-2">
            <Suspense>
                <CityList />
                <template #fallback>
                    <CityCardSkeleton />
                </template>
            </Suspense>
        </div>
    </main>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { uid } from 'uid'

const searchQuery = ref("")
const searchResults = ref(null)
const searchError = ref(false)

useHead({
    titleTemplate: 'Home %s'
})

const getSearchResult = async () => {
    if (searchQuery === "") {
        searchResults.value = null
        return
    }

    try {
        const data = await $fetch('/api/geocoding', {
            query: {
                searchText: searchQuery.value
            }
        })

        if (data)
            searchResults.value = data
    } catch (err) {
        searchError.value = true
    }

}
const debouncedSearch = debounce(getSearchResult, 400)

const previewCity = async (searchResult) => {
    let trackedCity = null
    try {
        if (localStorage.getItem('savedCities')) {
            const savedCities = JSON.parse(localStorage.getItem('savedCities'))

            trackedCity = savedCities.find(city => {
                return city.coords.lat === searchResult.lat.toString()
                    && city.coords.lon === searchResult.lon.toString()
            })
        }

        if (trackedCity) {
            const routePath = `weather/${trackedCity.city}~${trackedCity.country}`
            await navigateTo(
                {
                    path: routePath,
                    query: {
                        lat: trackedCity.coords.lat,
                        lon: trackedCity.coords.lon,
                        state: trackedCity.state,
                        id: trackedCity.id
                    }
                }
            )

        } else {
            const routePath = `weather/${searchResult.name}~${searchResult.country}`
            await navigateTo(
                {
                    path: routePath,
                    query: {
                        lat: searchResult.lat,
                        lon: searchResult.lon,
                        preview: true,
                        state: searchResult.state,
                        id: uid()
                    }
                }
            )
        }
    } catch {
    }
}

const clearInput = () => {
    searchQuery.value = null
    searchError.value = false
}
</script>
