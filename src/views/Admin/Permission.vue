<template>
    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Quản lý quyền</h1>

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
        <div v-if="permissionStore.loading" class="card-body">
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
                            <th>Tên quyền</th>
                            <th>Mô tả</th>
                            <th class="col-md-2">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="permission in permissionStore.permissions" :key="permission.id">
                            <td> <input type="checkbox" v-model="selected" :value="permission.id" /></td>
                            <td>{{ permission.name }}</td>
                            <td>{{ permission.description }}</td>
                            <td>
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-outline-primary btn-circle btn-sm me-2"
                                        @click="openModal(permission.id)"><i class="fas fa-pencil-alt"></i></button>
                                    <button type="button" class="btn btn-outline-danger btn-circle btn-sm"
                                        @click="deleteRole(permission.id)"><i
                                            class="fa-regular fa-trash-can"></i></button>
                                </div>

                            </td>
                        </tr>
                        <tr v-if="permissionStore.permissions.length === 0">
                            <td colspan="7" class="text-center text-muted">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
                <Pagination :page="page" :totalPages="permissionStore.totalPages" :size="size"
                    :totalItems="permissionStore.totalItems" @change="goToPage"></Pagination>
            </div>
        </div>
    </div>

    <PermissionModel ref="permissionModal" :permission="selectedPermission" @save="savePermission"></PermissionModel>
    <Notification ref="toastRef"></Notification>
</template>
<script setup>
import Pagination from '@/components/admin/Pagination.vue';
import Notification from '@/composable/Notification.vue';
import PermissionModel from '@/components/admin/page/PermissionModel.vue';
import { usePermissionStore } from '@/stores/permission';
import { computed, onMounted, ref, watch } from 'vue';

const permissionStore = usePermissionStore();

const keyword = ref("");
const page = ref(1);
const size = ref(10); // số item trên 1 trang

const permissionModal = ref(null);
const selectedPermission = ref(null);

const toastRef = ref(null);

const selected = ref([]);
const checkAllRef = ref(null);


const checkAll = computed({
    get() {
        const total = (permissionStore.permissions && permissionStore.permissions.length) || 0;
        return total > 0 && selected.value.length === total;
    },
    set(val) {
        if (val) {
            selected.value = (permissionStore.permissions || []).map(r => r.id);
        } else {
            selected.value = [];
        }
    }
});

watch(selected, () => {
    if (!checkAllRef.value) return;
    checkAllRef.value.indeterminate = selected.value.length > 0 && selected.value.length < permissionStore.permissions.length;
});

const openModal = async (id = null) => {
    if (id !== null) {
        const data = await permissionStore.getById(id);
        selectedPermission.value = data;
    } else {
        selectedPermission.value = null;
    }
    permissionModal.value.open();
};

const loadPermission = async () => {
    await permissionStore.searchPermission(keyword.value, page.value, size.value);
}

onMounted(() => {
    loadPermission();
})

const goToPage = (newPage) => {
    page.value = newPage;
    loadPermission();
}

watch(keyword, () => { // lắng nghe khi textchang
    page.value = 1;
    loadPermission();
})

const deleteRole = (id) => {
    if (!confirm("Bạn có chắc XÓA không?")) return;
    try {
        permissionStore.deletePermission(id);
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${roleStore.error}`, "error");
    }
}

const deleteAll = (listId) => {
    if (!confirm("Bạn có chắc XÓA các quyền đã chọn không?")) return;
    try {
        listId.forEach(async p => {
            await permissionStore.deletePermission(p.id);
        });
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${roleStore.error}`, "error");
    }
}

const savePermission = async ({ form, isEdit }) => {
    try {
        if (isEdit) {
            await permissionStore.updatePermission(form.id, form);
            toastRef.value.showToast("Cập nhật thành công!", "success");
        } else {
            await permissionStore.savePermission(form);
            toastRef.value.showToast("Thêm mới thành công!", "success");
        }

        loadPermission();
    } catch (err) {
        toastRef.value.showToast(`Lỗi : ${userStore.error}`, "error");
    }
};
</script>