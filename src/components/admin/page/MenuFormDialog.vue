<template>
    <Dialog v-model:visible="visible" modal :style="{ width: '650px' }" :header="isEdit ? 'Cập nhật menu' : 'Thêm menu'"
        @show="onShow">
        <form @submit.prevent="save">

            <!-- NAME -->
            <div class="mb-3">
                <label class="form-label">Tên menu</label>
                <input ref="nameInput" v-model="form.name" type="text" class="form-control" required />
            </div>

            <!-- PARENT MENU -->
            <div class="mb-3">
                <TreeTable v-if="treeTableData.length" :value="treeTableData" selectionMode="single"
                    v-model:selectionKeys="selectedKey" class="p-treetable-sm border">
                    <Column field="name" header="Tên menu" expander />
                </TreeTable>

                <small class="text-muted">
                    Click 1 dòng để chọn menu cha (để trống = menu gốc)
                </small>
            </div>
            <!-- Permission -->
            <div class="mb-3 w-full">
                <label class="form-label">Quyền</label>
                <MultiSelect v-model="form.permissionIds" :options="permissions" optionLabel="name" optionValue="id"
                    placeholder="Chọn quyền" class="permission-select" />
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

        </form>
    </Dialog>
</template>
<script setup>
import { ref, reactive, computed, watch, nextTick } from "vue";
import Dialog from "primevue/dialog";
import TreeTable from "primevue/treetable";
import Column from "primevue/column";
import IconPicker from "@/components/Icon/IconPicker.vue";
import MultiSelect from 'primevue/multiselect';

const visible = ref(false);
const selectedKey = ref({});
const nameInput = ref(null);

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

// Focus khi mở dialog
const onShow = async () => {
    await nextTick();
    nameInput.value?.focus();
};

// =======================
// TREE TABLE DATA
// =======================
const treeTableData = computed(() =>
    buildTreeTable(props.menusOther)
);

// Không cho chọn chính nó
function buildTreeTable(menus) {
    return menus
        .filter(m => m.id !== form.id)
        .map(menu => ({
            key: menu.id.toString(),
            data: {
                id: menu.id,
                name: menu.name
            },
            children: menu.children?.length ? buildTreeTable(menu.children) : []
        }));
}

// =======================
// LOAD EDIT DATA
// =======================
watch(() => props.menu,
    m => {
        if (!m) {
            resetForm();                 // QUAN TRỌNG
            selectedKey.value = {};      // reset menu cha
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

        // Highlight menu cha
        selectedKey.value = m.parentId ? { [m.parentId]: true } : {};
    },
    { immediate: true }
);
const isEdit = computed(() => !!props.menu);
// =======================
// OPEN / CLOSE
// =======================
const open = () => (visible.value = true);
const close = () => {
    resetForm();
    selectedKey.value = {};
    visible.value = false;
};

// =======================
// SAVE
// =======================
const save = () => {
    const key = Object.keys(selectedKey.value)[0];
    form.parentId = key ? Number(key) : null;

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