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
            <span>{{ node[optionLabel] }}</span>
        </div>

        <div v-if="expanded" class="ms-4">
            <TreeNode v-for="c in node.children" :key="c[optionValue]" :node="c" :selected="selected"
                :optionLabel="optionLabel" :optionValue="optionValue" @update="$emit('update', $event)" />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
    node: Object,
    selected: Array,
    optionLabel: String,
    optionValue: String
})

const emit = defineEmits(['update'])

const expanded = ref(false)
const checkboxRef = ref(null)
const hasChildren = computed(() => props.node.children?.length)

/* COLLECT CHILD IDS */
const collectIds = (node, arr = []) => {
    arr.push(node[props.optionValue])
    node.children?.forEach(c => collectIds(c, arr))
    return arr
}

const childIds = computed(() =>
    hasChildren.value ? collectIds(props.node).slice(1) : []
)

/* CHECK STATE */
const isChecked = computed(() =>
    hasChildren.value
        ? childIds.value.every(id => props.selected.includes(id))
        : props.selected.includes(props.node[props.optionValue])
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

/* TOGGLE */
const toggle = () => {
    let val = [...props.selected]
    const id = props.node[props.optionValue]

    if (hasChildren.value) {
        if (isChecked.value || isIndeterminate.value)
            val = val.filter(i => !childIds.value.includes(i))
        else
            childIds.value.forEach(i => !val.includes(i) && val.push(i))
    } else {
        val = val.includes(id)
            ? val.filter(i => i !== id)
            : [...val, id]
    }

    emit('update', val)
}

/* ICON */
const icon = computed(() =>
    hasChildren.value
        ? 'bi bi-folder-fill text-warning'
        : 'bi bi-file-earmark'
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
