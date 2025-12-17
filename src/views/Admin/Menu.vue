<template>

    <!-- Page Heading -->
    <h1 class="h3 mb-2 text-gray-800">Quản lý danh mục menu</h1>

    <div class="card shadow mb-4">
        <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <a href="#" class="btn btn-success btn-icon-split" @click="openModal()">
                    <span class="icon text-white-50">
                        <i class="fas fa-plus-square"></i>
                    </span>
                    <span class="text">Thêm mới</span>
                </a>
                <!-- <button type="button" class="btn btn-danger" @click="deleteAll(selected)" v-if="selected.length > 0">
                    <i class="fas fa-trash"></i> Xóa được chọn ({{ selected.length }})
                </button> -->
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
                <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                    <thead>
                        <tr>
                            <!-- <th><input type="checkbox" ref="checkAllRef" v-model="checkAll" /></th> -->
                            <th>Menu con</th>
                            <th>Tên menu</th>
                            <th>path</th>
                            <th>Icon</th>
                            <th>Thứ tự</th>
                            <th>Active</th>
                            <th class="col-md-2">

                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <MenuRow v-for="menu in menuStore.menus" :key="menu.id" :menu="menu" :expanded="expanded"
                            @toggle="toggleMenu" @edit="openModal" @delete="deleteMenu"></MenuRow>
                        <tr v-if="menuStore.menus.length === 0">
                            <td colspan="7" class="text-center text-muted">Không có dữ liệu</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <Notification ref="toastRef"></Notification>
</template>

<script setup>

import { onMounted, ref, watch } from 'vue';
import Notification from '@/components/Notification.vue';
import { useMenuStore } from '@/stores/menu';
import MenuRow from '@/components/admin/page/MenuRow.vue';

const menuStore = useMenuStore();
const toastRef = ref(null);

const keyword = ref("");

const expanded = ref([])

const toggleMenu = (id) => {
    if (expanded.value.includes(id)) {
        expanded.value = expanded.value.filter(i => i !== id)
    } else {
        expanded.value.push(id)
    }
};

const loadMenus = async () => {
    await menuStore.getSearch(keyword.value);
};

watch(keyword, () => {
    loadMenus();
});

onMounted(() => {
    loadMenus();
});

const openModal = (user = null) => {
    // selectedUser.value = user;
    // userModal.value.open();
};

const deleteMenu = (id) => {

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
</style>