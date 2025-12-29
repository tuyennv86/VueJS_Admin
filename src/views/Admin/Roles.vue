<template>
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Quản lý vai trò</h1>

    <div class="card shadow mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <a href="#" class="btn btn-success btn-icon-split" @click="openModal()">
                    <span class="icon text-white-50">
                        <i class="fas fa-plus-square"></i>
                    </span>
                    <span class="text">Thêm mới</span>
                </a>
                <button type="button" class="btn btn-danger" @click="deleteAll(selected)" v-if="selected.length > 0">
                    <i class="fas fa-trash"></i> Xóa được chọn ({{ selected.length }})
                </button>
                <div class="input-group w-50">
                    <input v-model="keyword" type="text" class="form-control" placeholder="Nhập từ khóa tìm kiếm..." />
                    <button type="button" class="btn btn-info" @click="loadUsers">
                        <i class="fa-solid fa-magnifying-glass"></i> Tìm kiếm
                    </button>
                </div>
            </div>
        </div>
        <!-- Loading -->
        <div v-if="roleStore.loading" class="card-body">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tải...</span>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <th><input type="checkbox" ref="checkAllRef" v-model="checkAll" />
                            </th>
                            <th>Tên vai trò</th>
                            <th>Mô tả</th>
                            <th class="col-md-2">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="role in roleStore.roles" :key="role.id">
                            <td> <input type="checkbox" v-model="selected" :value="role.id" /></td>
                            <td>{{ role.name }}</td>
                            <td>{{ role.description }}</td>
                            <td>
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-outline-primary btn-circle btn-sm me-2"
                                        @click="openModal(role.id)"><i class="fas fa-pencil-alt"></i></button>
                                    <button type="button" class="btn btn-outline-danger btn-circle btn-sm"
                                        @click="deleteRole(role.id)"><i class="fa-regular fa-trash-can"></i></button>
                                </div>

                            </td>
                        </tr>
                        <tr v-if="roleStore.roles.length === 0">
                            <td colspan="7" class="text-center text-muted">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
                <Pagination :page="page" :totalPages="roleStore.totalPages" :size="size"
                    :totalItems="roleStore.totalItems" @change="goToPage"></Pagination>
            </div>
        </div>
    </div>
    <RoleFormModel ref="roleModal" :role="selectedRole" :menus="menuStore.menus"
        :permissions="permissionStore.permissions" @save="saveRole"></RoleFormModel>

    <Notification ref="toastRef"></Notification>
</template>
<script setup>
import Pagination from '@/components/admin/Pagination.vue';
import Notification from '@/components/Notification.vue';
import RoleFormModel from '@/components/admin/page/RoleFormModel.vue';
import { useRoleStore } from '@/stores/role';
import { usePermissionStore } from '@/stores/permission';
import { useMenuStore } from '@/stores/menu';
import { computed, onMounted, ref, watch } from 'vue';

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const menuStore = useMenuStore();

const keyword = ref("");
const page = ref(1);
const size = ref(10); // số item trên 1 trang

const roleModal = ref(null);
const selectedRole = ref(null);

const toastRef = ref(null);

const selected = ref([]);
const checkAllRef = ref(null);


const checkAll = computed({
    get() {
        const total = (roleStore.roles && roleStore.roles.length) || 0;
        return total > 0 && selected.value.length === total;
    },
    set(val) {
        if (val) {
            selected.value = (roleStore.roles || []).map(r => r.id);
        } else {
            selected.value = [];
        }
    }
});

watch(selected, () => {
    if (!checkAllRef.value) return;
    checkAllRef.value.indeterminate = selected.value.length > 0 && selected.value.length < roleStore.roles.length;
});

const openModal = async (id = null) => {
    if (id !== null) {
        selectedRole.value = await roleStore.getById(id);
    } else {
        selectedRole.value = null;
    }
    roleModal.value.open();
};

const loadRoles = async () => {
    await roleStore.getSearch(keyword.value, page.value, size.value);
}

onMounted(() => {
    menuStore.getMenus();
    permissionStore.getAllPermission();
    loadRoles();
})

const goToPage = (newPage) => {
    page.value = newPage;
    loadRoles();
}

watch(keyword, () => { // lắng nghe khi textchang
    page.value = 1;
    loadRoles();
})

const deleteRole = (id) => {
    if (!confirm("Bạn có chắc XÓA không?")) return;
    try {
        roleStore.deleteRole(id);
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${roleStore.error}`, "error");
    }
}

const deleteAll = (listId) => {
    if (!confirm("Bạn có chắc XÓA các quyền đã chọn không?")) return;
    try {
        listId.forEach(async role => {
            await roleStore.deleteRole(role.id);
        });
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${roleStore.error}`, "error");
    }
}

const saveRole = async ({ form, isEdit }) => {
    try {
        if (isEdit) {
            await roleStore.updateRole(form.id, form);
            toastRef.value.showToast("Cập nhật thành công!", "success");
        } else {
            await roleStore.createRole(form);
            toastRef.value.showToast("Thêm mới thành công!", "success");
        }

        loadRoles();
    } catch (err) {
        toastRef.value.showToast(`Lỗi : ${userStore.error}`, "error");
    }
};
</script>