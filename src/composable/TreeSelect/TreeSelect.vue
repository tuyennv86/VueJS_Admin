<template>
    <div ref="wrapper" class="position-relative w-100">

        <!-- SELECT BOX -->
        <div class="form-control d-flex align-items-center justify-content-between tree-select" @click.stop="toggle">
            <!-- LEFT: LABEL -->
            <span class="text-truncate flex-grow-1">
                {{ selectedLabel || placeholder }}
            </span>

            <!-- RIGHT: ACTIONS -->
            <div class="d-flex align-items-center gap-2 ms-2">
                <!-- CLEAR -->
                <span v-if="modelValue" class="tree-clear" @click.stop="clearAll">
                    ✕
                </span>

                <!-- CARET -->
                <span class="tree-caret" :class="{ open }">
                    ▾
                </span>
            </div>
        </div>

        <!-- DROPDOWN -->
        <div v-if="open" class="dropdown-menu show w-100 shadow-sm p-2" @click.stop>
            <NodeSelect v-for="node in options" :key="node[optionValue]" :node="node" :selected="modelValue"
                :option-label="optionLabel" :option-value="optionValue" @select="onSelect" />
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import NodeSelect from './NodeSelect.vue'

const props = defineProps({
    modelValue: [String, Number],
    options: {
        type: Array,
        required: true
    },
    optionLabel: {
        type: String,
        default: 'label'
    },
    optionValue: {
        type: String,
        default: 'id'
    },
    placeholder: {
        type: String,
        default: 'Select'
    }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const wrapper = ref(null)

/* TOGGLE */
const toggle = () => {
    open.value = !open.value
}

/* SELECT */
const onSelect = (node) => {
    emit('update:modelValue', node[props.optionValue])
    open.value = false
}

/* CLEAR */
const clearAll = () => {
    emit('update:modelValue', null)
}

/* FIND LABEL */
const findLabel = (nodes, value) => {
    for (const n of nodes) {
        if (n[props.optionValue] === value) {
            return n[props.optionLabel]
        }
        if (n.children?.length) {
            const found = findLabel(n.children, value)
            if (found) return found
        }
    }
    return ''
}

const selectedLabel = computed(() =>
    findLabel(props.options, props.modelValue)
)

/* CLICK OUTSIDE */
const clickOutside = (e) => {
    if (!wrapper.value.contains(e.target)) {
        open.value = false
    }
}

onMounted(() => document.addEventListener('click', clickOutside))
onBeforeUnmount(() => document.removeEventListener('click', clickOutside))
</script>
<style scoped>
.tree-select {
    min-height: 40px;
    cursor: pointer;
}

/* CARET */
.tree-caret {
    font-size: 14px;
    color: #5f6368;
    transition: transform 0.2s ease;
    display: inline-block;
}

.tree-caret.open {
    transform: rotate(180deg);
}

/* CLEAR */
.tree-clear {
    font-size: 14px;
    color: #5f6368;
    cursor: pointer;
    line-height: 1;
}

.tree-clear:hover {
    color: #d93025;
}
</style>