<template>
    <div>
        <h2>Oh, snapp! something went wrong</h2>
        <button @click="handleError">Try Again</button>
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>
