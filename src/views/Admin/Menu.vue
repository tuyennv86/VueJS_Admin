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
                        <TreeRow v-for="item in menuStore.menus" :key="item.id" :item="item" :level="0" @edit="onEdit"
                            @delete="onDelete" @changisActive="onChangisActive" />
                    </tbody>
                </table>
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
import TreeRow from '@/composable/TreeRow/TreeRow.vue';


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
    openModal(menu.id);
}

const onDelete = async (menu) => {
    if (!confirm("Bạn có chắc XÓA không?")) return;
    try {
        await menuStore.deleteMenu(menu.id);
        toastRef.value.showToast("Đã xóa thành công!", "success");
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${menu.error}`, "error");
    }
}
const onSave = async ({ form, isEdit }) => {
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

const onChangisActive = async (menu) => {
    await menuStore.changIsActive(menu.id);
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
</script>