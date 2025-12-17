<template>
    <div class="modal fade" id="permissionModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
        data-bs-keyboard="false" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ isEdit ? "Cập nhật quyền" : "Thêm quyền" }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form @submit.prevent="handleSave">
                    <div class="modal-body">

                        <!-- NAME -->
                        <div class="mb-3">
                            <label class="form-label">Tên quyền</label>
                            <input v-model="form.name" type="text" class="form-control" required />
                        </div>

                        <!-- DESCRIPTION -->
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <input v-model="form.description" type="text" class="form-control" required />
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
    permission: Object
});

const emits = defineEmits(["save"]);

const form = reactive({
    id: null,
    name: "",
    description: ""
});

const resetForm = () => {
    Object.assign(form, {
        id: null,
        name: "",
        description: ""
    });
};

const setFormFromJson = (p) => {
    Object.assign(form, {
        id: p.id ?? null,
        name: p.name ?? "",
        description: p.description ?? ""
    });
};

// Đồng bộ dữ liệu khi props.permission thay đổi
watch(
    () => props.permission,
    (p) => {
        if (p && p.id) {
            setFormFromJson(p);
        } else {
            resetForm();
        }
    },
    { immediate: true, deep: true }
);

const isEdit = computed(() => !!form.id);

// MODAL
const modalRef = ref(null);
let bsModal = null;

onMounted(() => {
    bsModal = new bootstrap.Modal(modalRef.value);
});

const open = () => bsModal.show();
const close = () => bsModal.hide();

const handleSave = () => {
    emits("save", {
        form: { ...form },
        isEdit: isEdit.value
    });
    close();
    resetForm();
};

defineExpose({ open, close });
</script>