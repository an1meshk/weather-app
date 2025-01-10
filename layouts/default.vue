<template>
    <div class="min-h-screen">
        <div>
            <SiteNavigation />
        </div>
        <div>
            <slot />
        </div>
        <div class="sticky top-[100vh]">
            <Footer />
        </div>
    </div>
</template>

<script setup>

</script>
