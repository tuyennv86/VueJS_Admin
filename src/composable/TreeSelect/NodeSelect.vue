<template>
    <div>
        <div class="tree-item d-flex align-items-center" :class="{ active: selected === node[optionValue] }"
            @click.stop="selectNode">
            <!-- TOGGLE -->
            <i v-if="node.children?.length" class="bi me-1 toggle"
                :class="expanded ? 'bi-chevron-down' : 'bi-chevron-right'" @click.stop="expanded = !expanded"></i>

            <!-- ICON -->
            <i v-if="node.icon" :class="node.icon" class="me-2"></i>

            <!-- LABEL -->
            <span>{{ node[optionLabel] }}</span>
        </div>

        <!-- CHILDREN -->
        <div v-if="expanded" class="ms-4">
            <NodeSelect v-for="child in node.children" :key="child[optionValue]" :node="child" :selected="selected"
                :option-label="optionLabel" :option-value="optionValue" @select="$emit('select', $event)" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
    node: Object,
    selected: [String, Number],
    optionLabel: String,
    optionValue: String
})

const emit = defineEmits(['select'])
const expanded = ref(true)

const selectNode = () => emit('select', props.node)
</script>
<style scoped>
.tree-select {
    cursor: pointer;
    min-height: 40px;
}

.caret {
    transition: 0.2s;
}

.caret.open {
    transform: rotate(180deg);
}

.tree-item {
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
}

.tree-item:hover {
    background: #f1f3f4;
}

.tree-item.active {
    background: #e6f4ea;
    color: #137333;
    font-weight: 500;
}

.toggle {
    cursor: pointer;
    font-size: 12px;
}
</style>