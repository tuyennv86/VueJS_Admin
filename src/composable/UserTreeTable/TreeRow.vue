<template>
    <tr>
        <!-- NAME -->
        <td>
            <div class="d-flex align-items-center" :style="{ paddingLeft: `${level * 20}px` }">
                <!-- TOGGLE -->
                <span v-if="hasChildren" class="tree-toggle me-2" @click="expanded = !expanded">
                    <i class="fas" :class="expanded ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
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
            <button class="btn btn-outline-primary btn-circle btn-sm me-2" @click="$emit('edit', item)">
                <i class="fas fa-pencil-alt"></i>
            </button>
            <button class="btn btn-outline-danger btn-circle btn-sm" @click="$emit('remove', item)">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        </td>
    </tr>
    <!-- CHILDREN -->
    <TreeRow v-if="expanded" v-for="child in item.children" :key="child.id" :item="child" :level="level + 1"
        @edit="$emit('edit', $event)" @remove="$emit('remove', $event)" />
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['edit', 'remove'])

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
    color: #272727;
    font-weight: bold;
}

table td {
    vertical-align: middle;
}
</style>