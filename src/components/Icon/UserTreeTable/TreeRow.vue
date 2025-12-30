<template>
    <>
        <tr>
            <!-- NAME -->
            <td>
                <div class="d-flex align-items-center" :style="{ paddingLeft: `${level * 20}px` }">
                    <!-- TOGGLE -->
                    <span v-if="hasChildren" class="tree-toggle me-2" @click="expanded = !expanded">
                        {{ expanded ? '▼' : '▶' }}
                    </span>

                    <span v-else class="me-4"></span>

                    {{ item.name }}
                </div>
            </td>

            <!-- PATH -->
            <td>{{ item.path }}</td>

            <!-- ICON -->
            <td class="text-center">
                <i :class="item.icon"></i>
            </td>

            <!-- ORDER -->
            <td class="text-center">{{ item.sortOrder }}</td>

            <!-- ACTIVE -->
            <td class="text-center">
                <input type="checkbox" class="form-check-input" v-model="item.isActive" />
            </td>

            <!-- ACTION -->
            <td class="text-center">
                <button class="btn btn-sm btn-outline-primary me-1" @click="$emit('edit', item)">
                    ✏
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="$emit('remove', item)">
                    🗑
                </button>
            </td>
        </tr>

        <!-- CHILDREN -->
        <TreeRow v-if="expanded" v-for="child in item.children" :key="child.id" :item="child" :level="level + 1"
            @edit="$emit('edit', $event)" @remove="$emit('remove', $event)" />
        < />
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    item: Object,
    level: Number
})

const expanded = ref(false)

const hasChildren = computed(() =>
    props.item.children && props.item.children.length
)
</script>
<style scoped>
.tree-toggle {
    cursor: pointer;
    width: 18px;
    display: inline-block;
    text-align: center;
    color: #198754;
    font-weight: bold;
}

table td {
    vertical-align: middle;
}
</style>