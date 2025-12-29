<template>
    <div class="grid grid-cols-8 gap-3">
        <div v-for="icon in icons" :key="icon" class="icon-item" @click="$emit('select', `${prefix} ${icon}`)">
            <i :class="`${prefix} ${icon}`"></i>
        </div>
    </div>
</template>

<script setup>
defineProps({
    icons: Array,
    prefix: String
});
</script>

<style scoped>
.icon-item {
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
}

.icon-item:hover {
    background: #e0f2fe;
}

.icon-item i {
    font-size: 20px;
}
</style>