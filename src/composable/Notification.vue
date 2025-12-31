<template>
    <div class="toast-wrapper position-fixed top-0 end-0 p-3" style="z-index: 2000">
        <transition-group name="toast-fade-slide" tag="div">
            <div v-for="t in toasts" :key="t.id"
                class="toast align-items-center text-white border-0 show shadow-lg rounded mb-2" :class="t.typeClass"
                role="alert">
                <div class="d-flex align-items-center p-3">
                    <span class="me-3 fs-4" v-html="t.icon"></span>
                    <div class="flex-grow-1">{{ t.message }}</div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { reactive } from "vue";

let idCounter = 0;
const toasts = reactive([]);

const icons = {
    success: '<i class="fas fa-check-circle"></i>',
    error: '<i class="fas fa-times-circle"></i>',
    info: '<i class="fas fa-info-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>',
};

const showToast = (message, type = "success", duration = 3000) => {
    const id = idCounter++;
    const toast = {
        id,
        message,
        typeClass: type === "error" ? "bg-danger" : type === "warning" ? "bg-warning text-dark" : type === "info" ? "bg-info text-dark" : "bg-success",
        icon: icons[type],
    };

    toasts.push(toast);

    setTimeout(() => {
        const index = toasts.findIndex((t) => t.id === id);
        if (index !== -1) toasts.splice(index, 1);
    }, duration);
};

defineExpose({ showToast });
</script>

<style scoped>
.toast-fade-slide-enter-active,
.toast-fade-slide-leave-active {
    transition: all 0.4s ease;
}

.toast-fade-slide-enter-from {
    opacity: 0;
    transform: translateY(-20px);
}

.toast-fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-20px);
}

.toast-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
</style>