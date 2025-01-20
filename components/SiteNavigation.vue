<template>
  <header class="sticky top-0 bg-weather-primary shadow-lg">
    <nav class="container flex flex-col sm:flex-row items-center gap-4 text-white py-6">
      <NuxtLink to="/" class="text-2xl font-bold">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-sun fa-xl"></i>
          <p class="text-2xl">The Local Weather</p>
        </div>
      </NuxtLink>
      <div class="flex w-full items-center">
        <div class="flex-1 flex justify-center space-x-3 items-center pl-20">
          <i class="fa-solid fa-circle-info fa-md hover:text-weather-secondary duration-150 cursor-pointer"
            @click="toggleModal"></i>
          <i v-if="route.query.preview" class="fa-solid fa-plus fa-lg hover:text-weather-secondary duration-150 cursor-"
            @click="addCity"></i>
        </div>
        <h4 class="">&deg;C</h4>
        <i v-if="isLocalUnitMetric" class="fa-solid fa-toggle-off fa-xl ml-auto px-2" @click="handleToggleUnit"></i>
        <i v-else class="fa-solid fa-toggle-on fa-xl ml-auto px-2" @click="handleToggleUnit"></i>
        <h4 class="">&deg;F</h4>

        <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
          <div class="text-black">
            <h1 class="text-2xl mb-1">About:</h1>
            <p class="mb-4">
              The Local Weather allows you to track the weather for location of your choice.
            </p>
            <h2 class="text-2xl">How it works:</h2>
            <ol class="list-decimal list-inside mb-4">
              <li>
                Search for your location by entering the name into the
                search bar.
              </li>
              <li>
                Select a location within the results, this will take
                you to the current weather of selected location.
              </li>
              <li>
                You may also track it by clicking on the "+" icon at the
                top. This will save the location to view at a
                later time on the home page.
              </li>
            </ol>

            <h2 class="text-2xl">Removing a location:</h2>
            <p>
              If you no longer wish to track a location,
              go to the home page and simply tap the location you want to remove.
              Scroll to the bottom of the page, where you'll find the button to remove it.
            </p>
          </div>
        </BaseModal>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useUnitStore } from '~/stores/unitStore';
import { useLocationStore } from '~/stores/locationStore';
import { useSelectedCity } from '~/stores/selectedCityStore';

const route = useRoute()
const router = useRouter()
const modalActive = ref(false)
const unitStore = useUnitStore();
const locationStore = useLocationStore()
const selectedCityStore = useSelectedCity()
const isLocalUnitMetric = computed(() => {
  return unitStore.isMetricUnit
})

const addCity = () => {
  const locationObj = {
    id: route.query.id,
    state: route.query.state,
    city: route.params.city,
    country: route.params.country,
    coords: {
      lat: route.query.lat,
      lon: route.query.lon
    }
  }

  locationStore.addLocation(locationObj)
  selectedCityStore.updateSelectedCity(locationObj)

  let query = Object.assign({}, route.query)
  delete query.preview
  router.replace({ query })
}

const toggleModal = () => {
  modalActive.value = !modalActive.value
}

const handleToggleUnit = () => {
  unitStore.toggleUnit()
}

watch(modalActive, (active) => {
  if (active) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})
</script>
