<template>
    <div class="modal fade" id="roleModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static"
        data-bs-keyboard="false" ref="modalRef">
        <div class="modal-dialog">
            <div class="modal-content">

                <div class="modal-header">
                    <h5 class="modal-title">
                        {{ isEdit ? "Cập nhật vài trò" : "Thêm vai trò" }}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <form @submit.prevent="saveRole">
                    <div class="modal-body">

                        <!--  NAME -->
                        <div class="mb-3">
                            <label class="form-label">Tên vai trò</label>
                            <input v-model="form.name" type="text" class="form-control" required />
                        </div>

                        <!-- DESCRIPTION -->
                        <div class="mb-3">
                            <label class="form-label">Mô tả</label>
                            <input v-model="form.description" type="text" class="form-control" required />
                        </div>

                        <!-- menus -->
                        <div class="mb-3">
                            <label class="form-label">Chọn menus</label>
                            <TreeMultiSelect v-model="form.menuIds" :options="treeTableData" placeholder="Chọn menus" />
                        </div>
                        <!-- Premissions -->
                        <div class="mb-3">
                            <label class="form-label">Quyền</label>
                            <!-- <select v-model="form.permissionIds" multiple class="form-select" required>
                                <option v-for="permission in permissions" :key="permission.id" :value="permission.id">
                                    {{ permission.name }}
                                </option>
                            </select>
                            <small class="text-muted">Giữ Ctrl để chọn nhiều thành phần</small> -->
                            <MultiSelectDropdown v-model="form.permissionIds" :options="permissions" optionLabel="name"
                                optionValue="id">
                            </MultiSelectDropdown>
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
import TreeMultiSelect from "@/components/Icon/TreeMultinSelect/TreeMultiSelect.vue";
import MultiSelectDropdown from "@/components/Icon/MultiSelectDropdown.vue";

const props = defineProps({
    role: Object,
    menus: Array,
    permissions: Array
});
const selectedIds = ref([]);
// =======================
// TREE TABLE DATA
// =======================
const treeTableData = computed(() =>
    buildTreeTable(props.menus)
);

//Không cho chọn chính nó
function buildTreeTable(menus) {
    return menus
        .map(menu => ({
            id: menu.id,
            label: menu.name,
            children: menu.children?.length ? buildTreeTable(menu.children) : []
        }));
}

const emits = defineEmits(["save"]);

// FORM
const form = reactive({
    id: null,
    name: "",
    description: "",
    menuIds: [],
    permissionIds: []
});

const resetForm = () => {
    Object.assign(form, {
        id: null,
        name: "",
        description: "",
        menuIds: [],
        permissionIds: []
    });
};

// Load data khi mở modal
watch(
    () => props.role,
    (r) => {
        if (r) {
            Object.assign(form, {
                id: r.id,
                name: r.name,
                description: r.description,
                menuIds: r.menus?.map(m => m.id) || [],
                permissionIds: r.permissions?.map(p => p.id) || []
            });
        } else {
            resetForm();
        }
    },
    { immediate: true }
);

const isEdit = computed(() => !!props.role);

// MODAL
const modalRef = ref(null);
let bsModal = null;

onMounted(() => {
    bsModal = new bootstrap.Modal(modalRef.value);
});

const open = () => bsModal.show();
const close = () => bsModal.hide();

// Lưu vai trò người dùng
const saveRole = () => {
    emits("save", {
        form: { ...form },
        isEdit: isEdit.value
    });

    close();
    resetForm();
};

defineExpose({ open, close });
</script>
