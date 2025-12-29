<template>
    <div ref="wrapperRef" class="position-relative w-100">
        <!-- SELECTED FILES -->
        <div class="form-control d-flex flex-wrap gap-1 align-items-center" style="min-height: 40px; cursor: pointer"
            @click.stop="toggleDropdown">
            <template v-for="item in visibleTags" :key="item.id">
                <span class="drive-chip">
                    <i :class="item.icon"></i>
                    <span class="ms-1">{{ item.label }}</span>
                    <span class="ms-1 chip-close" @click.stop="remove(item.id)">×</span>
                </span>
            </template>

            <span v-if="hiddenCount" class="text-muted small">
                + {{ hiddenCount }} mục
            </span>
        </div>

        <!-- DROPDOWN -->
        <div v-if="open" class="dropdown-menu show w-100 shadow-sm p-0 mt-1" @click.stop>
            <!-- SEARCH -->
            <div class="p-2 border-bottom">
                <input v-model="search" class="form-control form-control-sm" placeholder="Tìm kiếm..." />
            </div>

            <!-- TREE -->
            <div class="px-2 py-1 overflow-auto" style="max-height: 260px">
                <TreeNode v-for="node in filteredTree" :key="node.id" :node="node" :selected="modelValue"
                    @update="update" />
            </div>

            <!-- FOOTER -->
            <div class="d-flex justify-content-between px-3 py-2 border-top small">
                <span>Đã chọn {{ modelValue.length }} mục</span>
                <a class="text-primary cursor-pointer" @click="clear">
                    Xóa tất cả
                </a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
    modelValue: { type: Array, default: () => [] },
    options: { type: Array, required: true },
    maxTag: { type: Number, default: 3 }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const search = ref('')
const wrapperRef = ref(null)

/* ========== CLICK OUTSIDE ========== */
const toggleDropdown = () => (open.value = !open.value)

const handleClickOutside = (e) => {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target))
        open.value = false
}

onMounted(() =>
    document.addEventListener('click', handleClickOutside)
)

onBeforeUnmount(() =>
    document.removeEventListener('click', handleClickOutside)
)

/* ========== FLATTEN TREE FOR TAGS ========== */
const fileIcon = (name) => {
    if (name.endsWith('.pdf')) return 'bi bi-file-earmark-pdf text-danger'
    if (name.endsWith('.doc') || name.endsWith('.docx'))
        return 'bi bi-file-earmark-word text-primary'
    if (name.endsWith('.png') || name.endsWith('.jpg'))
        return 'bi bi-file-earmark-image text-success'
    return 'bi bi-file-earmark'
}

const allItems = computed(() => {
    const res = []
    const walk = (nodes) => {
        nodes.forEach(n => {
            res.push({
                id: n.id,
                label: n.label,
                icon: n.children
                    ? 'bi bi-folder-fill text-warning'
                    : fileIcon(n.label)
            })
            n.children && walk(n.children)
        })
    }
    walk(props.options)
    return res
})

const selectedItems = computed(() =>
    allItems.value.filter(i => props.modelValue.includes(i.id))
)

const visibleTags = computed(() =>
    selectedItems.value.slice(0, props.maxTag)
)

const hiddenCount = computed(() =>
    selectedItems.value.length - visibleTags.value.length
)

/* ========== SEARCH TREE ========== */
const filterTree = (nodes, k) => {
    if (!k) return nodes
    return nodes
        .map(n => {
            const children = n.children
                ? filterTree(n.children, k)
                : []
            if (n.label.toLowerCase().includes(k) || children.length)
                return { ...n, children }
            return null
        })
        .filter(Boolean)
}

const filteredTree = computed(() =>
    filterTree(props.options, search.value.toLowerCase())
)

/* ========== ACTION ========== */
const update = (v) => emit('update:modelValue', v)
const remove = (id) =>
    emit('update:modelValue', props.modelValue.filter(i => i !== id))
const clear = () => emit('update:modelValue', [])
</script>

<style scoped>
.drive-chip {
    background: #e8f0fe;
    color: #1967d2;
    border-radius: 16px;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    font-size: 13px;
}

.chip-close {
    cursor: pointer;
}

.cursor-pointer {
    cursor: pointer;
}
</style>