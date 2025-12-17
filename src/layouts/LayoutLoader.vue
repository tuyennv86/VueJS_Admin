<template>
    <component :is="layoutComponent">
    </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from "vue-router";

//import layout
import DashboardLayout from './DashboardLayout.vue';
import HomeLayout from './HomeLayout.vue';
import LoginLayout from './LoginLayout.vue';

const route = useRoute();

// tự động switch ra các layout

const layoutComponent = computed(() => {

    const layout = route.meta.layout || "home";

    switch (layout) {
        case "auth": return LoginLayout;
        case "admin": return DashboardLayout;
        case "home":
        default: return HomeLayout;
    }

})
</script>