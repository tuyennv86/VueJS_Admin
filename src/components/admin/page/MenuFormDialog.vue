<template>
    <!-- <Dialog v-model:visible="visible" modal :style="{ width: '650px' }" :header="isEdit ? 'Cập nhật menu' : 'Thêm menu'"
        @show="onShow"> -->
    <div class="modal fade" id="menuModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
        data-bs-keyboard="false" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ isEdit ? "Cập nhật vài trò" : "Thêm vai trò" }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <form @submit.prevent="save">
                    <div class="modal-body">
                        <!-- NAME -->
                        <div class="mb-3">
                            <label class="form-label">Tên menu</label>
                            <input ref="nameInput" v-model="form.name" type="text" class="form-control" required />
                        </div>

                        <!-- PARENT MENU -->
                        <div class="mb-3">
                            <label class="form-label">Menu cha</label>
                            <TreeSelect v-model="form.parentId" :options="menusOther" optionLabel="name"
                                optionValue="id" placeholder="Chọn menu cha" />
                        </div>
                        <!-- Permission -->
                        <div class="mb-3 w-full">
                            <label class="form-label">Quyền</label>
                            <MultiSelectDropdown v-model="form.permissionIds" :options="permissions" optionLabel="name"
                                optionValue="id" placeholder="Chọn quyền"></MultiSelectDropdown>
                        </div>
                        <!-- PATH -->
                        <div class="mb-3">
                            <label class="form-label">Đường dẫn</label>
                            <input v-model="form.path" class="form-control" />
                        </div>

                        <!-- ICON -->
                        <div class="mb-3">
                            <label class="form-label">Icon</label>
                            <input v-model="form.icon" class="form-control" />
                            <IconPicker v-model="form.icon" />
                        </div>

                        <!-- ORDER -->
                        <div class="mb-3">
                            <label class="form-label">Thứ tự</label>
                            <input v-model="form.sortOrder" type="number" class="form-control" />
                        </div>

                        <!-- ACTIVE -->
                        <div class="form-check mb-3">
                            <input v-model="form.isActive" type="checkbox" class="form-check-input" />
                            <label class="form-check-label">Kích hoạt</label>
                        </div>

                        <!-- FOOTER -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="close">
                                Hủy
                            </button>
                            <button type="submit" class="btn btn-primary">
                                {{ isEdit ? "Lưu" : "Thêm mới" }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- </Dialog> -->
</template>
<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import * as bootstrap from "bootstrap";
import IconPicker from "@/composable/IconPicker.vue";
import MultiSelectDropdown from "@/composable/MultiSelectDropdown.vue";
import TreeSelect from "@/composable/TreeSelect/TreeSelect.vue";


const modalRef = ref(null);
let bsModal = null;
onMounted(() => {
    bsModal = new bootstrap.Modal(modalRef.value);
});

const open = () => bsModal.show();
const close = () => { resetForm(); bsModal.hide(); }


const props = defineProps({
    menu: Object,
    menusOther: {
        type: Array,
        default: () => []
    },
    permissions: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(["save"]);

// FORM
const form = reactive({
    id: null,
    name: "",
    path: "",
    icon: "",
    parentId: null,
    sortOrder: 0,
    isActive: true,
    permissionIds: []
});

const resetForm = () => {
    Object.assign(form, {
        id: null,
        name: "",
        path: "",
        icon: "",
        parentId: null,
        sortOrder: 0,
        isActive: true,
        permissionIds: []
    });
};

watch(() => props.menu,
    m => {
        if (!m) {
            resetForm();
            return;
        }

        Object.assign(form, {
            id: m.id,
            name: m.name,
            path: m.path,
            icon: m.icon,
            parentId: m.parentId,
            sortOrder: m.sortOrder,
            isActive: m.isActive,
            permissionIds: m.permissions ? m.permissions.map(p => p.id) : []
        });
    },
    { immediate: true }
);
const isEdit = computed(() => !!props.menu);

const save = () => {

    emit("save", {
        form: { ...form },
        isEdit: isEdit.value
    });

    resetForm();
    close();

};

defineExpose({ open, close });
</script>
<style scoped>
.p-treetable {
    border: 1px solid #dee2e6;
}

.p-treetable .p-highlight {
    background: #e7f1ff;
}

.permission-select,
.permission-select .p-multiselect {
    width: 100% !important;
}
</style>