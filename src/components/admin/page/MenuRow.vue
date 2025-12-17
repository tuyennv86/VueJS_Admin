<template>
    <tr :class="level === 0 ? 'parent-row' : 'child-row'">
        <td>
            <button v-if="menu.children && menu.children.length" @click="toggle(menu.id)">
                {{ isExpanded ? '-' : '+' }}
            </button>
        </td>
        <td> <span v-html="prefix"></span>{{ menu.name }}</td>
        <td>{{ menu.path }}</td>
        <td><i :class="`fa fa-${menu.icon} mr-2`"></i></td>
        <td>{{ menu.sortOrder }}</td>
        <td>
            <i class="fa-solid fa-square-check text-success" v-if="menu.isActive"></i>
            <i class="fa-solid fa-circle-xmark text-danger" v-else></i>
        </td>
        <td>
            <div class="d-flex justify-content-end">
                <button class="btn btn-outline-primary btn-circle btn-sm me-2" @click="$emit('edit', menu.id)">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="btn btn-outline-danger btn-circle btn-sm" @click="$emit('delete', menu.id)">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        </td>
    </tr>

    <!-- ĐỆ QUY -->
    <template v-if="isExpanded">
        <MenuRow v-for="child in menu.children" :key="child.id" :menu="child" :level="level + 1" :expanded="expanded"
            @toggle="$emit('toggle', $event)" @edit="$emit('edit', $event)" @delete="$emit('delete', $event)" />
    </template>
</template>

<script setup>
import { computed } from "vue";
import MenuRow from "./MenuRow.vue";

const props = defineProps({
    menu: Object,
    level: { type: Number, default: 0 },
    expanded: Array
});

const emit = defineEmits(["toggle", "edit", "delete"]);

const isExpanded = computed(() => props.expanded.includes(props.menu.id));

const toggle = (id) => emit("toggle", id);

// prefix tree: └──, └────
const prefix = computed(() => {
    if (props.level === 0) return "";
    return "└" + "──".repeat(props.level) + " ";
});
</script>