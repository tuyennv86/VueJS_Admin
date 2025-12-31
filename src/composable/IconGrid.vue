<template>
    <div class="icon-grid">
        <div v-for="icon in icons" :key="icon" class="icon-item" @click="$emit('select', `${prefix} ${icon}`)">
            <i :class="`${prefix} ${icon}`"></i><br></br>
            <small>{{ icon }}</small>
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
.icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 10px;
}

.icon-item {
    text-align: center;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
}

.icon-item:hover {
    background: #f1f3f5;
}

.icon-item i {
    font-size: 20px;
}
</style>