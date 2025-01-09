<template>
    <div>
        <Suspense>
            <AsyncCityView />
            <template #fallback>
                <CityViewSkeleton />
            </template>
        </Suspense>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()

useHead({
    titleTemplate: `${route.params.city} %s`
})
</script>

<style lang="scss" scoped></style>