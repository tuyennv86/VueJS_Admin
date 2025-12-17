<template>

    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Quản lý acount</h1>

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
        <div v-if="userStore.loading" class="card-body">
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
                            <th @click.prevent="sortBy = 'fullName'; loadUsers()">Họ tên</th>
                            <th>Ảnh</th>
                            <th @click.prevent="sortBy = 'username'; loadUsers()">UserName</th>
                            <th @click.prevent="sortBy = 'email'; loadUsers()">Email</th>
                            <th>Active</th>
                            <th>Quyền</th>
                            <th class="col-md-2">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user in userStore.users" :key="user.id">
                            <td> <input type="checkbox" v-model="selected" :value="user.id" /></td>
                            <td>{{ user.fullName }}</td>
                            <td>
                                <img v-if="user.imageUrl" :src="apiUrl + 'uploads/' + user.imageUrl"
                                    :alt="user.fullName" style="max-width: 200px;" class="img-responsive">
                            </td>
                            <td>{{ user.username }}</td>
                            <td>{{ user.email }}</td>
                            <td>
                                <i class="fa-solid fa-square-check text-success" v-if="user.isActive"></i>
                                <i class="fa-solid fa-circle-xmark text-danger" v-else></i>
                            </td>
                            <td>
                                <div v-for="role in user.roles" :key="role.id">
                                    <div class="text-info">{{ role.name }}</div>
                                </div>
                            </td>
                            <td>
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-outline-primary btn-circle btn-sm me-2"
                                        @click="openModal(user)"><i class="fas fa-pencil-alt"></i></button>
                                    <button type="button" class="btn btn-outline-danger btn-circle btn-sm"
                                        @click="deleteUser(user.id)"><i class="fa-regular fa-trash-can"></i></button>
                                </div>

                                <!-- <div v-for="r in roleStore.roles">{{ r.name }}</div> -->
                            </td>
                        </tr>
                        <tr v-if="userStore.users.length === 0">
                            <td colspan="7" class="text-center text-muted">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
                <Pagination :page="page" :totalPages="userStore.totalPages" :size="size"
                    :totalItems="userStore.totalItems" @change="goToPage"></Pagination>
            </div>
        </div>
    </div>
    <UserFormModal ref="userModal" :user="selectedUser" :roles="roleStore.roles" @save="saveUser"></UserFormModal>

    <Notification ref="toastRef"></Notification>
</template>

<script setup>

import Pagination from '@/components/admin/Pagination.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoleStore } from '@/stores/role';
import UserFormModal from '@/components/admin/page/UserFormModal.vue';
import Notification from '@/components/Notification.vue';

const userStore = useUserStore();
const roleStore = useRoleStore();

const apiUrl = import.meta.env.VITE_API_URL;

const keyword = ref("");
const page = ref(1);
const size = ref(10); // số item trên 1 trang
const sortBy = ref("id");

const userModal = ref(null);
const selectedUser = ref(null);

const toastRef = ref(null);

const selected = ref([]);
const checkAllRef = ref(null);


const checkAll = computed({
    get() {
        const total = (userStore.users && userStore.users.length) || 0;
        return total > 0 && selected.value.length === total;
    },
    set(val) {
        if (val) {
            selected.value = (userStore.users || []).map(u => u.id);
        } else {
            selected.value = [];
        }
    }
});

watch(selected, () => {
    if (!checkAllRef.value) return;
    checkAllRef.value.indeterminate = selected.value.length > 0 && selected.value.length < userStore.users.length;
});

const openModal = (user = null) => {
    selectedUser.value = user;
    userModal.value.open();
};

const saveUser = async ({ form, imageFile, isEdit }) => {
    try {
        if (isEdit) {
            await userStore.updateUser(form.id, form, imageFile);
            toastRef.value.showToast("Cập nhật người dùng thành công!", "success");
        } else {
            await userStore.createUser(form, imageFile);
            toastRef.value.showToast("Thêm mới người dùng thành công!", "success");
        }

        loadUsers();
    } catch (err) {
        toastRef.value.showToast(`Lỗi : ${userStore.error}`, "error");
    }
};

const deleteAll = async (arrayCheck) => {
    if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ nhưng người được chọn không?")) return;
    try {
        arrayCheck.forEach(async id => {
            await userStore.deleteUser(id);
        });
        selected.value = ref([]);// set lại mang chọn = 0
        toastRef.value.showToast("Đã xóa thành công!", "success");
    } catch (error) {
        toastRef.value.showToast(`Lỗi : ${userStore.error}`, "error");
    }
}

const deleteUser = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
        await userStore.deleteUser(id);
        toastRef.value.showToast("Đã xóa thành công!", "success");
    } catch (err) {
        toastRef.value.showToast(`Lỗi : ${userStore.error}`, "error");
    }
};

const loadUsers = async () => {
    await userStore.getAllUserSearch(keyword.value, page.value, size.value, sortBy.value);
}


const goToPage = (newPage) => {
    page.value = newPage;
    loadUsers();
}

watch(keyword, () => {
    page.value = 1;
    loadUsers();
})
onMounted(() => {
    roleStore.getAllRole();
    loadUsers();
})
</script>
<style scoped>
/* .form-control {
    @apply w-full border rounded-md px-3 py-2;
}

.btn {
    @apply px-3 py-2 rounded-md;
} */
</style>