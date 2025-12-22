<template>
    <div class="modal fade" id="menuModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
        data-bs-keyboard="false" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ isEdit ? "Cập nhật menu" : "Thêm menu" }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form @submit.prevent="save">
                    <div class="modal-body">

                        <!-- NAME -->
                        <div class="mb-3">
                            <label class="form-label">Tên Menu</label>
                            <input v-model="form.name" type="text" class="form-control" required />
                        </div>
                        <!-- Order -->
                        <div class="mb-3">
                            <select v-model="form.parentId" class="form-select" required>
                                <option v-for="menu in menusOther" :key="menu.id" :value="menu.id">
                                    {{ menu.name }}
                                </option>
                            </select>
                        </div>
                        <!-- path -->
                        <div class="mb-3">
                            <label class="form-label">Đường dẫn</label>
                            <input v-model="form.path" type="email" class="form-control" required />
                        </div>

                        <!-- icon -->
                        <div class="mb-3">
                            <label class="form-label">Icon</label>
                            <input v-model="form.icon" type="text" class="form-control" required />
                        </div>

                        <!-- Order -->
                        <div class="mb-3">
                            <input v-model="form.sortOrder" type="number" class="form-control" required />
                        </div>

                        <!-- ACTIVE -->
                        <div class="form-check">
                            <input v-model="form.isActive" type="checkbox" class="form-check-input" id="isActive" />
                            <label for="isActive" class="form-check-label">Kích hoạt</label>
                        </div>

                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="submit" class="btn btn-primary">
                            {{ isEdit ? "Lưu thay đổi" : "Thêm mới" }}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, computed, ref, watch, onMounted } from "vue";
import * as bootstrap from "bootstrap";

const props = defineProps({
    menu: Object,
    menusOther: Array
});

const emits = defineEmits(["save"]);

// FORM
const form = reactive({
    id: null,
    name: "",
    path: "",
    icon: "",
    parentId: null,
    sortOrder: 0,
    isActive: false
});

const resetForm = () => {
    Object.assign(form, {
        id: null,
        name: "",
        path: "",
        icon: "",
        parentId: null,
        sortOrder: 0,
        isActive: false
    });
};

// Load data khi mở modal
watch(() => props.menu,
    (u) => {
        if (m) {
            Object.assign(form, {
                id: m.id,
                name: u.name,
                path: u.path,
                icon: u.icon,
                parentId: m.parentId,
                sortOrder: m.sortOrder,
                isActive: u.isActive
            });
        } else {
            resetForm();
        }
    },
    { immediate: true }
);

const isEdit = computed(() => !!props.menu);

// MODAL
const modalRef = ref(null);
let bsModal = null;

onMounted(() => {
    bsModal = new bootstrap.Modal(modalRef.value);
});

const open = () => bsModal.show();
const close = () => bsModal.hide();

// Lưu người dùng
const save = () => {
    emits("save", {
        form: { ...form }
    });

    close();
    resetForm();
};

defineExpose({ open, close });
</script>
