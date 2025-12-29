<template>
    <div>
        <!-- Trigger -->
        <div class="icon-picker-trigger" @click="visible = true">
            <i v-if="modelValue" :class="modelValue"></i>
            <span v-else class="text-muted">Chọn icon</span>
        </div>

        <!-- Dialog -->
        <Dialog v-model:visible="visible" modal header="Chọn icon" :style="{ width: '720px' }">
            <!-- Search -->
            <div class="mb-3">
                <InputText v-model="keyword" placeholder="Tìm icon..." class="w-full" />
            </div>

            <!-- Tabs -->
            <TabView>
                <TabPanel header="Solid">
                    <IconGrid prefix="fa-solid" :icons="filteredIcons.solid" @select="selectIcon" />
                </TabPanel>

                <TabPanel header="Regular">
                    <IconGrid prefix="fa-regular" :icons="filteredIcons.regular" @select="selectIcon" />
                </TabPanel>

                <TabPanel header="Brands">
                    <IconGrid prefix="fa-brands" :icons="filteredIcons.brands" @select="selectIcon" />
                </TabPanel>
            </TabView>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Dialog from "primevue/dialog";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import InputText from "primevue/inputtext";
import { FA_ICONS } from "@/utils/fontawesome-icons";
import IconGrid from "./IconGrid.vue";


/* v-model */
const modelValue = defineModel();

const visible = ref(false);
const keyword = ref("");

const filteredIcons = computed(() => {
    const k = keyword.value.toLowerCase();
    const filter = list => list.filter(i => i.includes(k));
    return {
        solid: filter(FA_ICONS.solid),
        regular: filter(FA_ICONS.regular),
        brands: filter(FA_ICONS.brands)
    };
});

const selectIcon = icon => {
    modelValue.value = icon;
    visible.value = false;
};
</script>

<style scoped>
.icon-picker-trigger {
    border: 1px solid #ced4da;
    border-radius: 6px;
    padding: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
}

.icon-picker-trigger:hover {
    background: #f8f9fa;
}
</style>