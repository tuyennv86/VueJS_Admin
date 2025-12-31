<template>
    <table class="table table-bordered align-middle">
        <thead class="table-light">
            <tr>
                <th>Tên menu</th>
                <th>Đường dẫn</th>
                <th class="text-center">Icon</th>
                <th class="text-center">Thứ tự</th>
                <th class="text-center">Active</th>
                <th class="text-center">Action</th>
            </tr>
        </thead>

        <tbody>
            <TreeRow v-for="item in data" :key="item.id" :item="item" :level="0" @edit="emit('edit', $event)"
                @remove="emit('delete', $event)" @changisActive="emit('changisActive', $event)" />
        </tbody>
    </table>
</template>

<script setup>
import TreeRow from "./TreeRow.vue";

defineProps({
    data: Array
});

const emit = defineEmits(["edit", "delete", "changisActive"]);
</script>