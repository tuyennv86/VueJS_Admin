<template>
    <div class="icon-picker">
        <!-- Trigger -->
        <div class="icon-picker-trigger" @click="open">
            <i v-if="modelValue" :class="modelValue"></i>
            <span v-else class="text-muted">Chọn icon</span>
        </div>

        <!-- Modal -->
        <div v-if="visible" class="modal-overlay" @click="close">
            <div class="modal" @click.stop>
                <!-- Header -->
                <div class="modal-header">
                    <h3>Chọn icon</h3>
                    <button type="button" class="close-btn" @click="close">×</button>
                </div>

                <!-- Search -->
                <input v-model="keyword" class="search" placeholder="Tìm icon..." />

                <!-- Tabs -->
                <div class="tabs">
                    <button v-for="tab in tabs" :key="tab.key" type="button" :class="{ active: activeTab === tab.key }"
                        @click="activeTab = tab.key">
                        {{ tab.label }}
                    </button>
                </div>

                <!-- Content -->
                <div class="tab-content">
                    <IconGrid v-show="activeTab === 'solid'" prefix="fa-solid" :icons="filteredIcons.solid"
                        @select="selectIcon" />

                    <IconGrid v-show="activeTab === 'regular'" prefix="fa-regular" :icons="filteredIcons.regular"
                        @select="selectIcon" />

                    <IconGrid v-show="activeTab === 'brands'" prefix="fa-brands" :icons="filteredIcons.brands"
                        @select="selectIcon" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import IconGrid from "./IconGrid.vue";
import { FA_ICONS } from "@/utils/fontawesome-icons";

/* v-model */
const modelValue = defineModel();

const visible = ref(false);
const keyword = ref("");
const activeTab = ref("solid");

const tabs = [
    { key: "solid", label: "Solid" },
    { key: "regular", label: "Regular" },
    { key: "brands", label: "Brands" }
];

const filteredIcons = computed(() => {
    const k = keyword.value.toLowerCase();
    const filter = list => list.filter(i => i.includes(k));
    return {
        solid: filter(FA_ICONS.solid),
        regular: filter(FA_ICONS.regular),
        brands: filter(FA_ICONS.brands)
    };
});

const open = () => {
    visible.value = true;
};

const close = () => {
    visible.value = false;
};

const selectIcon = icon => {
    modelValue.value = icon;
    close();
};

/* ESC close */
const onKeydown = e => {
    if (e.key === "Escape") close();
};

onMounted(() => {
    window.addEventListener("keydown", onKeydown);
});

onUnmounted(() => {
    window.removeEventListener("keydown", onKeydown);
});
</script>

<style scoped>
.icon-picker-trigger {
    border: 1px solid #ced4da;
    border-radius: 6px;
    padding: 10px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.icon-picker-trigger:hover {
    background: #f8f9fa;
}

/* Modal */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.modal {
    width: 720px;
    max-height: 80vh;
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.close-btn {
    border: none;
    background: none;
    font-size: 22px;
    cursor: pointer;
}

.search {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

/* Tabs */
.tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 10px;
}

.tabs button {
    padding: 6px 12px;
    border: 1px solid #ddd;
    background: #f8f9fa;
    cursor: pointer;
    border-radius: 4px;
}

.tabs button.active {
    background: #0d6efd;
    color: #fff;
    border-color: #0d6efd;
}

.tab-content {
    overflow-y: auto;
    flex: 1;
}
</style>