<template>
    <hr class="sidebar-divider" />
    <li class="nav-item">
        <router-link :to="`/admin${menu.path}`" class="nav-link">
            <i :class="`${menu.icon} mr-2`"></i>
            <span>{{ menu.name }}</span>
        </router-link>

        <ul class="ml-2 border-l border-gray-700 pl-2" v-if="menu.children && menu.children.length">
            <menu-item v-for="child in menu.children" :key="child.id" :menu="child"></menu-item>
        </ul>
    </li>

</template>
<script setup>
import MenuItem from "./SidebarMenuItem.vue";
defineProps({
    menu: Object
})
</script>