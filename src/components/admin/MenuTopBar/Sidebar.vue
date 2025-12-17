<template>
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" :class="{ toggled: isToggled }"
        id="accordionSidebar">
        <!-- Sidebar - Brand -->
        <router-link class="sidebar-brand d-flex align-items-center justify-content-center" to="/admin/dashboard">
            <div class="sidebar-brand-icon rotate-n-15">
                <i class="fas fa-laugh-wink"></i>
            </div>
            <div class="sidebar-brand-text mx-3">Admin <sup>2</sup></div>
        </router-link>

        <div v-if="loading">Đang tải menu...</div>

        <SidebarMenuItem v-for="menu in usermenus" :key="menu.id" :menu="menu"></SidebarMenuItem>


        <hr class="sidebar-divider d-none d-md-block" />

        <!-- Sidebar Toggler -->
        <div class="text-center d-none d-md-inline">
            <button class="rounded-circle border-0" id="sidebarToggle" @click="$emit('toggleSidebar')"></button>
        </div>
    </ul>
</template>
<script setup>
import { onMounted } from 'vue';
import SidebarMenuItem from './SidebarMenuItem.vue';
import { useMenuStore } from '@/stores/menu';
import { storeToRefs } from 'pinia';

const menuStore = useMenuStore();

const { usermenus, loading } = storeToRefs(menuStore);

onMounted(async () => {
    if (usermenus.value.length === 0) {
        await menuStore.getMenusByUser();
        //await menuStore.getMyMenus();
    }
})

defineProps({
    isToggled: Boolean,
});

</script>

<style scoped></style>