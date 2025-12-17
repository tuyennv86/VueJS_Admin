<template>
    <div id="wrapper" :class="{ 'sidebar-toggled': isSidebarToggled }">
        <!-- Sidebar -->
        <sidebar :isToggled="isSidebarToggled" @toggleSidebar="toggleSidebar"></sidebar>
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <topbar @toggleSidebar="toggleSidebar"></topbar>
                <!-- Router View -->
                <div class="container-fluid">
                    <router-view />
                </div>
            </div>

            <!-- Footer -->
            <fouter></fouter>
        </div>
    </div>
</template>

<script setup>
// Import riêng cho layout Admin
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/assets/css/sb-admin-2.css"; // CSS gốc của SB Admin 2
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Chỉ dùng JS bundle (không cần jQuery)

import { ref } from "vue";

import Sidebar from "@/components/admin/MenuTopBar/Sidebar.vue";
import Topbar from "@/components/admin/MenuTopBar/Topbar.vue";
import Fouter from "@/components/admin/MenuTopBar/Fouter.vue";


const isSidebarToggled = ref(false);
const toggleSidebar = () => (isSidebarToggled.value = !isSidebarToggled.value);


</script>

<style scoped></style>