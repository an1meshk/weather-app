<template>
    <div class="flex flex-col min-h-screen font-Roboto bg-weather-primary">
        <NuxtLayout>
            <div class="flex flex-col flex-1 my-4 text-white py-4 bg-weather-secondary w-full text-center">
                <h2>{{ error?.message ?? "Oh, snapp! something went wrong" }}</h2>
                <NuxtLink to="/" class="text-blue-400 hover:underline">Try
                    Again</NuxtLink>
            </div>
        </NuxtLayout>
    </div>
</template>

<script setup>
useHead({
    titleTemplate: 'Error %s'
})
const error = useError();
</script>
