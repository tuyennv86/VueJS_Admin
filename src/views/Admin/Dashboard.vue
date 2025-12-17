<template>
    <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p>Xin chào, {{ authStore.user?.name }}</p>
    </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
</script>