<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <input v-model="searchQuery" @input="debouncedSearch" type="text" placeholder="Search for a city or state"
                class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow-sm">
            <ul v-if="searchResults"
                class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]">
                <p v-if="searchError">Oh, snapp! something went wrong try again.</p>

                <p v-if="!searchError && searchResults?.length === 0">No results match your query, try a differen term.
                </p>

                <template v-else>
                    <li v-for="searchResult in searchResults" :key="searchResult.lat" class="py-2 cursor-pointer"
                        @click="previewCity(searchResult)">
                        {{ `${searchResult.name}, ${searchResult.state}, ${searchResult.country}` }}
                    </li>
                </template>
            </ul>
        </div>
        <div class="flex flex-col gap-4">
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

const searchQuery = ref("")
const searchResults = ref(null)
const searchError = ref(null)

useHead({
    titleTemplate: 'Home %s'
})
const getSearchResult = async () => {
    if (searchQuery === "") {
        searchResults.value = null
        return
    }

    try {
        const { data } = await useFetch('/api/geocoding', {
            immediate: false,
            query: {
                searchText: searchQuery
            },
            transform: data => {
                searchResults.value = data
            }
        })
    } catch {
        searchError.value = true
    }
}
const debouncedSearch = debounce(getSearchResult, 300)

const previewCity = async (searchResult) => {
    const routePath = `weather/${searchResult.name.replaceAll(" ", "")}~${searchResult.state.replaceAll(" ", "")}`

    await navigateTo(
        {
            path: routePath,
            query: {
                lat: searchResult.lat,
                lon: searchResult.lon,
                preview: true
            }
        }
    )
}
</script>
