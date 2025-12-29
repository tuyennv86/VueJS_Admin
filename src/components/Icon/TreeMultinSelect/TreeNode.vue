<template>
    <div class="ms-4">
        <div class="d-flex align-items-center gap-2 py-1 drive-row">
            <!-- ARROW -->
            <span v-if="hasChildren" class="drive-arrow" @click="expanded = !expanded">
                {{ expanded ? '▾' : '▸' }}
            </span>

            <!-- CHECKBOX -->
            <input ref="checkboxRef" type="checkbox" class="form-check-input mt-0" :checked="isChecked"
                @change="toggle" />
            <!-- ICON -->
            <i :class="icon"></i>
            <!-- LABEL -->
            <span>{{ node.label }}</span>
        </div>

        <div v-if="expanded" class="ms-4">
            <TreeNode v-for="c in node.children" :key="c.id" :node="c" :selected="selected"
                @update="$emit('update', $event)" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
    node: Object,
    selected: Array
})

const emit = defineEmits(['update'])

const expanded = ref(false)
const checkboxRef = ref(null)
const hasChildren = computed(() => props.node.children?.length)

/* collect children ids */
const collectIds = (node, arr = []) => {
    arr.push(node.id)
    node.children?.forEach(c => collectIds(c, arr))
    return arr
}

const childIds = computed(() =>
    hasChildren.value ? collectIds(props.node).slice(1) : []
)

/* checkbox state */
const isChecked = computed(() =>
    hasChildren.value ? childIds.value.every(id => props.selected.includes(id)) : props.selected.includes(props.node.id)
)

const isIndeterminate = computed(() => {
    if (!hasChildren.value) return false
    const count = childIds.value.filter(id =>
        props.selected.includes(id)
    ).length
    return count > 0 && count < childIds.value.length
})

const syncIndeterminate = () => {
    if (checkboxRef.value)
        checkboxRef.value.indeterminate = isIndeterminate.value
}

onMounted(syncIndeterminate)
watch([isChecked, isIndeterminate], syncIndeterminate)

/* toggle */
const toggle = () => {
    let val = [...props.selected]

    if (hasChildren.value) {
        if (isChecked.value || isIndeterminate.value)
            val = val.filter(i => !childIds.value.includes(i))
        else
            childIds.value.forEach(i => !val.includes(i) && val.push(i))
    } else {
        if (val.includes(props.node.id))
            val = val.filter(i => i !== props.node.id)
        else
            val.push(props.node.id)
    }

    emit('update', val)
}

/* icon */
const icon = computed(() =>
    hasChildren.value ? 'bi bi-folder-fill text-warning' : 'bi bi-file-earmark'
)
</script>

<style scoped>
.drive-row:hover {
    background: #f1f3f4;
    border-radius: 4px;
}

.drive-arrow {
    width: 14px;
    cursor: pointer;
    color: #5f6368;
}
</style>