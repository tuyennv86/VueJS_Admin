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
            <div class="table-responsive">
                <UserTreeTable :data="menuStore.menus" @edit="onEdit" @delete="onDelete"></UserTreeTable>
            </div>
        </div>
    </div>
    <MenuFormDialog ref="menuModal" :menu="selectedMenu" :menusOther="menuStore.menus"
        :permissions="permissionStore.permissions" @save="onSave">
    </MenuFormDialog>
    <Notification ref="toastRef"></Notification>
</template>

<script setup>

import { onMounted, ref, watch } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { usePermissionStore } from '@/stores/permission';
import Notification from '@/composable/Notification.vue';
import MenuFormDialog from '@/components/admin/page/MenuFormDialog.vue';
import UserTreeTable from '@/composable/UserTreeTable/UserTreeTable.vue';


const menuStore = useMenuStore();
const permissionStore = usePermissionStore();

const keyword = ref("");

const menuModal = ref(null);
const selectedMenu = ref(null);
const toastRef = ref(null);

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
const onEdit = (menu) => {
    // console.log('EDIT MENU:', menu)
    openModal(menu.id);
    // mở modal sửa
}

const onDelete = async (menu) => {
    //console.log('DELETE MENU:', menu)
    if (!confirm("Bạn có chắc XÓA không?")) return;
    try {
        await menuStore.deleteMenu(menu.id);
        toastRef.value.showToast("Đã xóa thành công!", "success");
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${menu.error}`, "error");
    }
}
const onSave = async ({ form, isEdit }) => {
    console.log("Edit", isEdit);
    console.log("Form", form);
    try {
        if (isEdit) {
            await menuStore.updateMenu(form.id, form);
            toastRef.value.showToast("Cập nhật thành công!", "success");

        } else {
            await menuStore.insertMenu(form);
            toastRef.value.showToast("Thêm mới thành công!", "success");
        }
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${menu.error}`, "error");
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

// const deleteMenu = async (id) => {
//     confirm.require({
//         message: 'Bạn có muốn Xóa menu này không?',
//         header: 'Confirmation',
//         icon: 'pi pi-exclamation-triangle',
//         rejectClass: 'p-button-secondary p-button-outlined',
//         rejectLabel: 'Cancel',
//         acceptLabel: 'Xóa',
//         accept: async () => {
//             try {
//                 await menuStore.deleteMenu(id);
//                 toast.add({ severity: 'success', summary: 'Thành công!', detail: 'Đã xóa Menu vừa chọn', life: 3000 });
//             } catch (err) {
//                 toast.add({ severity: 'error', summary: 'Lỗi', detail: `Lỗi : ${menuStore.error}`, life: 3000 });
//             }
//         }
//         //,
//         // reject: () => {            
//         //     toast.add({ severity: 'error', summary: 'Error Message', detail: 'Message Content', life: 3000 });
//         // }
//     });
// }

</script>