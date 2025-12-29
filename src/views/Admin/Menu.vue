<template>

    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Quản lý danh mục menu</h1>

    <div class="card shadow mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <a href="#" class="btn btn-success btn-icon-split" @click="openModal(null)">
                    <span class="icon text-white-50">
                        <i class="fas fa-plus-square"></i>
                    </span>
                    <span class="text">Thêm mới</span>
                </a>

                <div class="input-group w-50">
                    <input v-model="keyword" type="text" class="form-control" placeholder="Nhập từ khóa tìm kiếm..." />
                    <button type="button" class="btn btn-info" @click="loadMenus">
                        <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm
                    </button>
                </div>
            </div>
        </div>
        <!-- Loading -->
        <div v-if="menuStore.loading" class="card-body">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>
        <div class="card-body">
            <div class="card">
                <TreeTable :value="treeNodes">
                    <Column field="name" header="Tên menu" expander />
                    <Column field="path" header="Đường dẫn" />
                    <Column header="Icon">
                        <template #body="{ node }">
                            <i :class="`${node.data.icon} mr-2`"></i>
                        </template>
                    </Column>
                    <Column field="sortOrder" header="Thứ tự" />

                    <Column header="Active">
                        <template #body="{ node }">
                            <i v-if="node.data.isActive" class="fa-solid fa-square-check text-success"></i>
                            <i v-else class="fa-solid fa-circle-xmark text-danger"></i>
                        </template>
                    </Column>

                    <Column header="Action" style="width:10rem">
                        <template #body="{ node }">
                            <Button class="btn btn-outline-primary btn-circle btn-sm me-2"
                                @click="openModal(node.data.id)">
                                <i class="fas fa-pencil-alt"></i>
                            </Button>
                            <Button class="btn btn-outline-danger btn-circle btn-sm" @click="deleteMenu(node.data.id)">
                                <i class="fa-regular fa-trash-can"></i>
                            </Button>
                        </template>
                    </Column>
                </TreeTable>

            </div>

        </div>
    </div>
    <Toast></Toast>
    <ConfirmDialog></ConfirmDialog>

    <MenuFormDialog ref="menuModal" :menu="selectedMenu" :menusOther="menuStore.menus"
        :permissions="permissionStore.permissions" @save="onSave">
    </MenuFormDialog>
</template>

<script setup>

import { onMounted, ref, watch, computed } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { usePermissionStore } from '@/stores/permission';
import { TreeTable, Column, ConfirmDialog, Toast } from 'primevue';
import MenuFormDialog from '@/components/admin/page/MenuFormDialog.vue';

import { useConfirm } from "primevue/useconfirm";
import { useToast } from 'primevue/usetoast';

const confirm = useConfirm();
const toast = useToast();
const menuStore = useMenuStore();
const permissionStore = usePermissionStore();

const keyword = ref("");

const menuModal = ref(null);
const selectedMenu = ref(null);

const openModal = async (id) => {
    if (id !== null) {
        selectedMenu.value = await menuStore.getById(id);
    }
    else {
        selectedMenu.value = null;
    }
    await getMenuOther();
    await getPermission();
    menuModal.value.open();
};

const getMenuOther = async () => {
    await menuStore.getMenus();
}

const getPermission = async () => {
    await permissionStore.getAllPermission();
}

const onSave = async ({ form, isEdit }) => {
    try {
        if (isEdit) {
            await menuStore.updateMenu(form.id, form);
            toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Cập nhật menu thành công!', life: 3000 });

        } else {
            await menuStore.insertMenu(form);
            toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Thêm mới menu thành công!', life: 3000 });
        }
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Lỗi', detail: `Lỗi : ${menuStore.error} - ${error}`, life: 3000 });
    }


    // visible.value = false
}

const treeNodes = computed(() =>
    menuStore.menus.map(mapMenuToNode)
)

function mapMenuToNode(menu) {
    return {
        key: menu.id,
        data: menu,
        children: menu.children?.map(mapMenuToNode) || []
    }
}

//
const loadMenus = async () => {
    await menuStore.getSearch(keyword.value);
};

watch(keyword, () => {
    loadMenus();
});

onMounted(async () => {
    await loadMenus();
});

const deleteMenu = async (id) => {
    confirm.require({
        message: 'Bạn có muốn Xóa menu này không?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-outlined',
        rejectLabel: 'Cancel',
        acceptLabel: 'Xóa',
        accept: async () => {
            try {
                await menuStore.deleteMenu(id);
                toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Đã xóa Menu vừa chọn', life: 3000 });
            } catch (err) {
                toast.add({ severity: 'error', summary: 'Lỗi', detail: `Lỗi : ${menuStore.error}`, life: 3000 });
            }
        }
        //,
        // reject: () => {            
        //     toast.add({ severity: 'error', summary: 'Error Message', detail: 'Message Content', life: 3000 });
        // }
    });
}

</script>
<style scoped>
.menu-table {
    width: 100%;
    border-collapse: collapse;
}

.menu-table th,
.menu-table td {
    border: 1px solid #ddd;
    padding: 8px;
}

.parent-row {
    background: #f5f7fa;
    font-weight: 600;
}

.child-row {
    background: #fff;
}

.tree-prefix {
    white-space: pre;
    font-family: monospace;
}
</style>